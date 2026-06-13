"use client";

import Image from "next/image";

import target from "@/assets/images/target.svg";
import RadioButton from "@/assets/images/RadioButton.svg";
import OverviewCard from "@/components/UI/OverviewCard";
import { formatDate, readingValidation, showToast } from "@/utils";
import { GoalType } from "@/utils/types";
import { useRef, useState } from "react";

import { Toast } from "primereact/toast";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase/client";

type ShowGoalProp = {
    goal: GoalType;
};
export default function ShowGoal({ goal }: ShowGoalProp) {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

    const toast = useRef<Toast>(null);
    const handleAddGoal = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);
        const goalName = formData.get("goalName");
        const systolic = Number(formData.get("systolic"));
        const diastolic = Number(formData.get("diastolic"));
        const pulse = Number(formData.get("pulse"));
        const endDate = formData.get("endDate");
        const note = formData.get("note");

        const validations = [
            {
                isInvalid: !goalName,
                summary: "Missing goal name",
                detail: "Enter a name for this goal.",
            },
            {
                isInvalid: !endDate,
                summary: "Missing end date",
                detail: "Select an end date for this goal.",
            },
        ];

        for (const validation of validations) {
            if (!validation.isInvalid) {
                continue;
            }

            showToast(toast, "error", validation.summary, validation.detail);
            return;
        }

        readingValidation({
            toast,
            session: session?.user?.id ?? null,
            sys: systolic,
            dia: diastolic,
            pulse,
        });
        setLoading(true);
        const data = {
            user_id: session?.user?.id,
            goal_name: goalName,
            systolic,
            diastolic,
            pulse,
            end_date: endDate,
            note,
        };
        const { error } = await supabase.from("goals").update(data).eq("id", goal.id);

        if (error) {
            showToast(toast, "error", "Error updating goal", error.message);
            setLoading(false);
            return;
        }

        showToast(toast, "success", "Goal updated", "Your goal has been updated.");
        setLoading(false);
        
        setCanEdit(false);
        form.reset();
    };

    const headerTopContent = (
        <section className="flex items-center justify-between gap-x-3 pt-2">
            <div className="flex-2 flex items-center gap-x-3 text-base text-gray-700 font-medium">
                <Image src={target} alt="Latest Readings" width={50} height={50} />
                <div className="dark:text-foreground">Latest Readings</div>
            </div>

            <div
                onClick={() => setCanEdit(!canEdit)}
                className="cursor-pointer text-xs font-medium text-gray-500 dark:text-white-200 underline underline-offset-2"
            >
                Edit goal
            </div>
        </section>
    );
    return (
        <section>
            <Toast ref={toast} position="top-right" />
            <OverviewCard topContent={headerTopContent}>
                {!canEdit && (
                    <section className="p-4 m-4 rounded-lg bg-white-400 dark:bg-black-400">
                        <div className="flex items-center gap-x-2 text-black-500 dark:text-white-200 mb-4">
                            <Image src={RadioButton} alt="target" width={20} height={20} />
                            <p>{goal.goal_name}</p>
                        </div>
                        <section className="space-y-4 dark:text-white-500 ">
                            <div className="flex gap-x-2 items-center font-semibold bg-white-100 dark:bg-black-100 text-black dark:text-white-500 rounded-lg pl-4 py-1">
                                <h1 className="text-2xl sm:text-3xl">
                                    {goal.systolic} / {goal.diastolic}
                                </h1>{" "}
                                <span className="text-base">mmhg</span>
                            </div>
                            <div className="flex gap-x-2 items-center font-semibold bg-white-100 dark:bg-black-100 text-black dark:text-white-500 rounded-lg pl-4 py-1">
                                <h1 className="text-2xl sm:text-3xl">{goal.pulse} </h1>{" "}
                                <span className="text-base">bpm</span>
                            </div>
                            <p>Due date by: {formatDate(goal.end_date)}</p>
                        </section>
                    </section>
                )}

                {canEdit && (
                    <section className="p-4">
                        <form onSubmit={handleAddGoal} className="space-y-4">
                            <div>
                                <label htmlFor="goalName" className="labelStyle">
                                    Goal name
                                </label>
                                <input
                                    type="text"
                                    name="goalName"
                                    id="goalName"
                                    className="inputStyle"
                                    placeholder="Enter your goal name"
                                    defaultValue={goal.goal_name}
                                />
                            </div>
                            <section className="flex items-center gap-x-4 justify-between">
                                <div className="space-y-3 w-1/2">
                                    <label htmlFor="systolic" className="labelStyle">
                                        Target Systolic{" "}
                                    </label>
                                    <input
                                        type="number"
                                        name="systolic"
                                        id="systolic"
                                        className="inputStyle"
                                        placeholder="120"
                                        defaultValue={goal.systolic}
                                    />
                                </div>

                                <div className="space-y-3 w-1/2">
                                    <label htmlFor="diastolic" className="labelStyle">
                                        Target Diastolic{" "}
                                    </label>
                                    <input
                                        type="number"
                                        name="diastolic"
                                        id="diastolic"
                                        className="inputStyle"
                                        placeholder="80"
                                        defaultValue={goal.diastolic}
                                    />
                                </div>
                            </section>
                            <div>
                                <label htmlFor="pulse" className="labelStyle">
                                    Pulse
                                </label>
                                <input
                                    type="number"
                                    name="pulse"
                                    id="pulse"
                                    className="inputStyle"
                                    placeholder="70"
                                    defaultValue={goal.pulse}
                                />
                            </div>

                            <div>
                                <label htmlFor="endDate" className="labelStyle">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    id="endDate"
                                    className="inputStyle"
                                    placeholder="Select end date"
                                    defaultValue={goal.end_date.split("T")[0]}
                                />
                            </div>

                            <div>
                                <label htmlFor="note" className="labelStyle">
                                    Note
                                </label>
                                <textarea
                                    name="note"
                                    id="note"
                                    className="inputStyle"
                                    placeholder="Add any notes about this reading (optional)"
                                    defaultValue={goal.note || ""}
                                    rows={4}
                                ></textarea>
                            </div>

                            {/* 🚨 Actions  */}

                            <section className="flex gap-x-4 items-center">
                                <button
                                    type="submit"
                                    className="px-4 cursor-pointer py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                                >
                                    {loading ? "Loading..." : "Update Goal"}
                                </button>
                                <button
                                    type="reset"
                                    className="px-4 cursor-pointer py-2 bg-gray-500 text-white rounded-lg  transition-colors duration-300"
                                >
                                    Clear
                                </button>
                            </section>
                        </form>
                    </section>
                )}
            </OverviewCard>
        </section>
    );
}
