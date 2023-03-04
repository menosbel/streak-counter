import {formattedDate} from "./utils";

interface Streak {
    currentCount: number
    startDate: string
    lastLoginDate: string
}

const KEY = 'streak'

export function differenceInDays(dateLeft: Date, dateRight: Date): number {
    const diffTime = Math.abs(dateLeft.getTime() - dateRight.getTime())
    const differenceInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return differenceInDays
}

function shouldIncrementOrResetStreakCount(
    currentDate: Date,
    lastLoginDate: string,
): 'increment' | 'reset' {
    // We get 11/5/2021
    // so to get 5, we use our helper function
    const difference = differenceInDays(currentDate, new Date(lastLoginDate))
    // This means they logged in the day after the currentDate
    if (difference === 1) {
        return 'increment'
    }
    // Otherwise they logged in after a day, which would
    // break the streak
    return 'reset'
}

export function streakCounter(storage: Storage, date: Date): Streak {
    const streakInLocalStorage = storage.getItem(KEY)
    if (streakInLocalStorage) {
        try {
            const streak = JSON.parse(streakInLocalStorage)
            const state = shouldIncrementOrResetStreakCount(date, streak.lastLoginDate)
            const SHOULD_INCREMENT = state === "increment"

            if (SHOULD_INCREMENT) {
                const updatedStreak = {
                    ...streak,
                    currentCount: streak.currentCount + 1,
                    lastLoginDate: formattedDate(date),
                }
                storage.setItem(KEY, JSON.stringify(updatedStreak))
                return updatedStreak
            }
            return streak
        } catch (e) {
            console.error("Failed to parse streak from LocalStorage")
        }
    }
    
    const streak = {
        currentCount: 1,
        startDate: formattedDate(date),
        lastLoginDate: formattedDate(date),
    }

    storage.setItem(KEY, JSON.stringify(streak))

    return streak
}