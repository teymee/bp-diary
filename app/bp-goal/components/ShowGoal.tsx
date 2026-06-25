"use client";

import Image from "next/image";

import target from "@/assets/images/target.svg";
import RadioButton from "@/assets/images/RadioButton.svg";
import OverviewCard from "@/components/UI/OverviewCard";
import { formatDate, getUserId, readingValidation, showToast } from "@/utils";
import { useEffect, useMemo, useRef, useState } from "react";

import { Toast } from "primereact/toast";
import { supabase } from "@/lib/supabase/client";
import { goalSelector, useGoalStore } from "@/store/goalStore";

import needImprov from "@/assets/images/needs-improvement.svg";
import onTrack from "@/assets/images/on-track.svg";

import { ProgressBar } from 'primereact/progressbar';
import { readingsSelectors, useReadingStore } from "@/store/readingsStore";

export default function ShowGoal() {

    const goal = useGoalStore(goalSelector.goal)


    const [loading, setLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

    const reverseReading = useReadingStore(readingsSelectors.readings)
    const fetchReadings = useReadingStore(s => s.getReadings)
    const readings = reverseReading?.reverse()

    const toast = useRef<Toast>(null);
    useEffect(() => {
        fetchReadings();
    }, [])


    const last7Readings = useMemo(() => {
        if (!readings || readings.length < 1 || !goal) {
            return {
                systolic: 0,
                diastolic: 0,
                pulse: 0
            }

        }
        const last7 = readings.slice(-7);
        const arrLength = last7.length

        const systolic = Math.floor(last7.reduce((acc, reading) => acc + reading.systolic, 0) / arrLength);
        const sysPercent = Math.floor(((160 - systolic) / (160 - goal.systolic)) * 100)
        const diastolic = Math.floor(last7.reduce((acc, reading) => acc + reading.diastolic, 0) / arrLength);
        const diaPercent = Math.floor(((100 - diastolic) / (100 - goal.diastolic)) * 100)
        const pulse = Math.floor(last7.reduce((acc, reading) => acc + reading.pulse, 0) / arrLength);
        const pulsePercent = Math.floor(((100 - pulse) / (100 - goal.pulse)) * 100)
        return {
            systolic,
            sysPercent,
            diastolic,
            diaPercent,
            pulse,
            pulsePercent
        }

    }, [readings, goal])

    if (!goal) return

    const handleAddGoal = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userId = await getUserId()

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
            session: userId,
            sys: systolic,
            dia: diastolic,
            pulse,
        });
        setLoading(true);
        const data = {
            user_id: userId,
            // session?.user?.id,
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



    const getTrack = (val: number) => {
        return val <= 50 ? needImprov : onTrack
    }



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
                <section className="space-y-10">
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


                    {
                        !canEdit && (
                            <section className="p-4">
                                <section className="flex items-center justify-between gap-x-2 text-black-500 dark:text-white-200 mb-4">
                                    <div>
                                        <h2>Recent Average (Last 7 readings)</h2>
                                    </div>

                                    <div>{last7Readings.systolic}/{last7Readings.diastolic} mmHg ({last7Readings.sysPercent}%/{last7Readings.diaPercent}%)</div>
                                </section>


                                {/* 🚨 Systolic & Diastolic */}

                                {last7Readings.sysPercent && (
                                    <section className="space-y-8">

                                        <section className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p>Systolic </p>

                                                <Image src={getTrack(last7Readings.sysPercent)} alt="track-level" />
                                            </div>
                                            <div>
                                                <ProgressBar value={last7Readings?.sysPercent} color={last7Readings.sysPercent < 50 ? "red" : "green"} />
                                            </div>
                                        </section>


                                        <section className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <p>Diastolic </p>

                                                <Image src={getTrack(last7Readings.diaPercent)} alt="track-level" />
                                            </div>
                                            <div>
                                                <ProgressBar value={last7Readings.diaPercent} color={last7Readings.diaPercent < 50 ? "red" : "green"} />
                                            </div>
                                        </section>

                                        <section className=" border-b border-white-200 pb-4">
                                            {last7Readings.sysPercent < 50 || last7Readings.diaPercent < 50 ? (
                                                <section className="w-full border-[#CA3520] border text-sm rounded-lg text-[#CA3520] bg-[#56312C] px-4 py-2">
                                                    <p>Keep working towards your goal. Small changes in diet, exercise, and stress management can help.</p>
                                                </section>
                                            ) : <section className="w-full border-[#62D38A] border text-sm rounded-lg text-[#62D38A] bg-[#1F3A27] px-4 py-2">
                                                <p>🎉 Great job! You&apos;re meeting your blood pressure goals. Keep up the healthy habits!</p>
                                            </section>}
                                        </section>

                                        <section className="space-y-2">

                                            <section className="flex items-center justify-between gap-x-2 text-black-500 dark:text-white-200 mb-4">
                                                <div>
                                                    <h2>Recent Average (Last 7 readings)</h2>
                                                </div>

                                                <div>{last7Readings.pulse} bpm ({last7Readings.pulsePercent}%)</div>
                                            </section>

                                            <div className="flex items-center justify-between">
                                                <p>Pulse</p>

                                                <Image src={getTrack(last7Readings.pulsePercent)} alt="track-level" />
                                            </div>
                                            <div>
                                                <ProgressBar value={last7Readings.pulsePercent} color={last7Readings.pulsePercent < 50 ? "red" : "green"} />
                                            </div>

                                            <section className="  pb-4 mt-4">
                                                {last7Readings.pulsePercent < 50 ? (
                                                    <section className="w-full border-[#CA3520] border text-sm rounded-lg text-[#CA3520] bg-[#56312C] px-4 py-2">
                                                        <p>Keep working towards your goal. Small changes in diet, exercise, and stress management can help.</p>
                                                    </section>
                                                ) : <section className="w-full border-[#62D38A] border text-sm rounded-lg text-[#62D38A] bg-[#1F3A27] px-4 py-2">
                                                    <p>🎉 Great job! You&apos;re meeting your pulse goals. Keep up the healthy habits!</p>
                                                </section>}
                                            </section>
                                        </section>

                                    </section>
                                )}

                            </section>
                        )
                    }
                </section>



            </OverviewCard>
        </section>
    );
}
