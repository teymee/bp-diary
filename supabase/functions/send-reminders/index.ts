// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import * as webpush from "jsr:@negrel/webpush";

console.log("Hello from Functions!");

// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req, ctx) => {
    // Called by another service with a secret key
    // ctx.supabaseAdmin bypasses RLS — use for privileged operations
    /*
    if (ctx.authMode === "secret") {
      const { user_id } = await req.json();
      const { data } = await ctx.supabaseAdmin.auth.admin.getUserById(user_id);

      return Response.json({
        email: data?.user?.email,
      });
    }
    */

    // const { name } = await req.json();

    // return Response.json({
    //   message: `Hello ${name}!`,
    // });

    // 🚨 Reminder query edge function

    const { data: reminders, error } = await ctx.supabaseAdmin
      .from("reminders")
      .select("*")
      .eq("is_enabled", true);

    if (error) {
      return Response.json(error, { status: 500 });
    }

    const nowInfo = getCurrentTime();

    const dueReminders = reminders.filter((reminder) =>
      isReminderDue(reminder, nowInfo),
    );

    for (const reminder of dueReminders) {
      const { data: subscription } = await ctx.supabaseAdmin
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", reminder.user_id)
        .single();

      if (!subscription) {
        continue;
      }

      console.log(`Send notification for ${reminder.title}`);

      // 🚨 Handle invalid subscriptions

      // Sometimes a browser subscription becomes invalid because the user cleared browser data or changed devices.

      try {
        //🚨 Send push notification here
        const vapidKeys = await webpush.importVapidKeys({
          subject: Deno.env.get("VAPID_SUBJECT"),
          publicKey: Deno.env.get("VAPID_PUBLIC_KEY"),
          privateKey: Deno.env.get("VAPID_PRIVATE_KEY"),
        });

        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify({
            title: reminder.title,
            body: "It's time to record your blood pressure.",
            url: "/add-reading",
            reminderId: reminder.id,
          }),
          {
            vapidKeys,
            ttl: 60,
          },
        );

        //

        await ctx.supabaseAdmin
          .from("reminders")
          .update({
            last_notified_at: new Date().toISOString(),
          })
          .eq("id", reminder.id);
      } catch (err) {
        console.error(err);
      }
    }

    return Response.json({
      checked: reminders.length,
      due: dueReminders.length,
    });
  }),
};

export const getCurrentTime = () => {
  const now = new Date();
  return {
    now,
    today: now.toISOString().split("T")[0],
    currentTime: now.toLocaleTimeString("en-GB", {
      hour12: false,
    }),
    currentWeekDay: now
      .toLocaleDateString("en-GB", {
        weekday: "long",
      })
      .toLowerCase(),
  };
};

export const isReminderDue = (reminder, nowInfo: object) => {
  const { today, currentTime, currentWeekDay } = nowInfo;
  const { start_date, end_date, time, last_notified_at, repeat_type } =
    reminder;

  // 🚨 Has reminder started
  if (start_date > today) {
    return false;
  }

  // 🚨 Has reminder expired
  if (end_date && today > end_date) {
    return false;
  }

  // 🚨 Has reminder excedded time
  if (time > currentTime) {
    return false;
  }

  // 🚨 Has reminder already run
  if (last_notified_at) {
    const lastSentDate = last_notified_at.split("T")[0];

    if (lastSentDate === today) {
      return false;
    }
  }

  // 🚨 Repeat type
  switch (repeat_type) {
    case "once":
      return today === start_date;

    case "daily":
      return true;

    case "weekly":
      return reminder.repeat_days?.includes(currentWeekDay) ?? false;

    default:
      return false;
  }

  //
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-reminders' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --data '{"name":"Functions"}'

*/
