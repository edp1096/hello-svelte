<svelte:options customElement="my-calendar" />

<script>
    "use strict";

    import "moment/dist/locale/ko";
    import moment from "moment";
    import { onMount, onDestroy } from "svelte";

    /**
     * @description
     * theme.
     * @type {string}
     */
    export let theme = "light";

    /**
     * @description
     * MutationObserver for theme changes.
     * @type {MutationObserver}
     */
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.attributeName === "data-theme") {
                setThemeFromHTML();
            }
        }
    });

    /**
     * @description
     * Set theme from HTML attribute.
     * @returns {void}
     */
    function setThemeFromHTML() {
        theme = document.documentElement.getAttribute("data-theme") || "light";
    }

    /**
     * @description
     * Observe theme changes.
     * @returns {void}
     */
    function observeThemeChanges() {
        observer.observe(document.documentElement, { attributes: true });
    }

    export let yearRangeBefore = 2;
    export let yearRangeAfter = 1;

    /**
     * @description
     * Calendar data.
     * @type {Object}
     * @property {number} selectedYear - Selected year.
     * @property {number} selectedMonth - Selected month.
     * @property {string[]} weekNames - Week names.
     * @property {number[]} years - Years.
     * @property {number[]} months - Months.
     * @property {Object[]} days - Days.
     */
    export let calendarData = {
        selectedYear: 0,
        selectedMonth: 0,
        weekNames: [],
        years: [],
        months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        days: [],
    };

    let selectorYear, selectorMonth;

    /**
     * @description
     * Setup selector years.
     * @param {moment.Moment} date - Date object.
     * @returns {void}
     */
    const setupSelectorYears = (date) => {
        calendarData.selectedYear = parseInt(moment(date).format("YYYY"));
        const beginYear = calendarData.selectedYear - yearRangeBefore;
        const endYear = calendarData.selectedYear + yearRangeAfter;

        calendarData.years = [];
        for (let i = beginYear; i <= endYear; i++) {
            calendarData.years.push(i);
        }
    };

    /**
     * @description
     * Setup selector months.
     * @param {moment.Moment} date - Date object.
     * @returns {void}
     */
    const setupSelectorMonths = (date) => {
        calendarData.selectedMonth = parseInt(moment(date).format("MM"));

        calendarData.months = [];
        for (let i = 1; i <= 12; i++) {
            calendarData.months.push(i);
        }
    };

    /**
     * @description
     * Move to today.
     * @returns {void}
     */
    const moveToday = () => {
        const today = moment();
        setupDays(today);
    };

    /**
     * @description
     * Move to previous month.
     * @returns {void}
     */
    const movePreviousMonth = () => {
        const ym = `${calendarData.selectedYear}-${calendarData.selectedMonth}`;
        const previousMonth = moment(ym, "YYYY-MM").subtract(1, "month");

        const minYear = calendarData.years[0];
        if (previousMonth.year() < minYear) {
            alert(`Min year is ${minYear}.`);
            return;
        }

        setupDays(previousMonth);
    };

    /**
     * @description
     * Move to next month.
     * @returns {void}
     */
    const moveNextMonth = () => {
        const ym = `${calendarData.selectedYear}-${calendarData.selectedMonth}`;
        const nextMonth = moment(ym, "YYYY-MM").add(1, "month");

        const maxYear = calendarData.years[calendarData.years.length - 1];
        if (nextMonth.year() > maxYear) {
            alert(`Max year is ${maxYear}.`);
            return;
        }

        setupDays(nextMonth);
    };

    /**
     * @description
     * Move to date by selector.
     * @returns {void}
     */
    const moveDateBySelector = () => {
        if (selectorYear && selectorMonth) {
            calendarData.selectedYear = parseInt(selectorYear.value);
            calendarData.selectedMonth = parseInt(selectorMonth.value);

            const ym = `${calendarData.selectedYear}-${calendarData.selectedMonth}`;
            const selectedYearMonth = moment(ym, "YYYY-MM");
            setupDays(selectedYearMonth);
        }
    };

    /**
     * @description
     * Setup days.
     * @param {moment.Moment} referenceDate - Reference date.
     * @returns {void}
     */
    const setupDays = (referenceDate) => {
        // const weekNames = moment.weekdaysShort(true);
        const weekNames = moment.weekdays(true);
        calendarData.weekNames = weekNames;

        const refDay = moment(referenceDate); // normally today

        calendarData.selectedMonth = parseInt(refDay.format("MM"));
        calendarData.selectedYear = parseInt(refDay.format("YYYY"));
        calendarData.days = [];

        const startOfMonth = moment(refDay).startOf("month");
        const endOfMonth = moment(refDay).endOf("month");

        const startOfCalendar = moment(startOfMonth).startOf("week");
        const endOfCalendar = moment(endOfMonth).endOf("week");

        const day = startOfCalendar;
        while (day.isSameOrBefore(endOfCalendar)) {
            calendarData.days.push({
                num: day.format("D"),
                isCurrentMonth: day.isSame(refDay, "month"),
                isToday: day.isSame(moment(), "day"),
                dayOfWeek: day.format("d"),
            });
            day.add(1, "day");
        }
    };

    onMount(() => {
        moment.locale("ko");
        const today = moment();

        setThemeFromHTML();
        observeThemeChanges();

        setupSelectorYears(today);
        setupSelectorMonths(today);
        setupDays(today);
    });

    onDestroy(() => {
        observer.disconnect();
    });
    // onDestroy(() => {});
</script>

<div class="calendar-container" data-theme={theme}>
    <div class="calendar-controls">
        <select
            name="calendar-selector-year"
            aria-label="Year"
            on:change={moveDateBySelector}
            bind:this={selectorYear}
            bind:value={calendarData.selectedYear}
        >
            {#each calendarData.years as year}
                <option value={year}>{year}</option>
            {/each}
        </select>

        <select
            name="calendar-selector-month"
            aria-label="Month"
            on:change={moveDateBySelector}
            bind:this={selectorMonth}
            bind:value={calendarData.selectedMonth}
        >
            {#each calendarData.months as month}
                <option value={month}>{month}</option>
            {/each}
        </select>

        <button type="button" on:click={moveToday}>Today</button>
        <button type="button" on:click={movePreviousMonth}>
            Previous Month
        </button>
        <button type="button" on:click={moveNextMonth}> Next Month </button>
    </div>

    <div class="calendar-view">
        <ul class="calendar-weekdays">
            {#each calendarData.weekNames as weekName}
                <li>{weekName}</li>
            {/each}
        </ul>
        <ul class="calendar-days">
            {#each calendarData.days as day}
                <li
                    class="calendar-day"
                    class:current-month={day.isCurrentMonth}
                    class:other-month={!day.isCurrentMonth}
                    class:today={day.isToday}
                >
                    <div class="calendar-day-container">
                        <span
                            class="calendar-day-num"
                            class:saturday={day.dayOfWeek == 6}
                            class:sunday={day.dayOfWeek == 0}
                        >
                            {day.num}
                        </span>
                        <span
                            class="calendar-day-event"
                            style="
                            color: #737;
                            background-color: #9cf;"
                        >
                            이벤트
                        </span>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
</div>

<!-- svelte-ignore css-unused-selector -->
<style lang="scss">
    @use "./global.css";

    :host {
        --calendar-container-background-color: #fff;
        --calendar-active-text-color: #555;
        --calendar-inactive-text-color: #aaa;
        --calendar-background-color: #fff;
        --calendar-border-color: #ddd;
        --calendar-hover-border-color: #a57070;
    }

    [data-theme="dark"] {
        --calendar-container-background-color: #555;
        --calendar-active-text-color: #fff;
        --calendar-inactive-text-color: #aaa;
        --calendar-background-color: #555;
        --calendar-border-color: #666;
        --calendar-hover-border-color: #a57070;
    }

    div,
    ul,
    li {
        padding: 0;
        margin: 0;
    }

    select {
        display: inline-block;
        width: auto;
        font-size: 1rem;
        color: var(--calendar-active-text-color);
        background-color: var(--calendar-background-color);
        &:hover {
            border-color: var(--calendar-active-text-color);
        }
    }

    div.calendar-container {
        background-color: var(--calendar-container-background-color);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        min-width: 15rem;
        height: 100%;
        overflow: auto;
    }

    div.calendar-controls {
        display: initial;
        white-space: nowrap;
        width: 100%;
    }

    div.calendar-view {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    ul.calendar-weekdays {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        height: 3rem;
        list-style: none;

        li {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            font-size: 1rem;
            font-weight: bold;
        }
    }

    ul.calendar-days {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
        height: calc(100% - 3.5rem);
        list-style: none;

        // calendar-day-container
        li {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: calc(100% / 7);
            div {
                display: inline-flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                width: 100%;
                height: calc(100% - 0.15rem);
                border: 0.01rem solid var(--calendar-border-color);
                margin: 0.03rem;
                font-size: 1.5rem;

                // Day number
                span.calendar-day-num {
                    width: 100%;
                    align-self: normal;
                    text-align: right;
                    font-size: 1rem;
                }

                // Event(s)
                span.calendar-day-event {
                    width: 100%;
                    align-self: normal;
                    color: #fff;
                    background-color: #d17bc8;
                    text-align: left;
                    font-size: 0.8rem;
                }
            }
            &:hover {
                div {
                    border-color: var(--calendar-hover-border-color) !important;
                }
            }
            &.current-month {
                color: var(--calendar-active-text-color);
                background-color: var(--calendar-background-color);
                height: auto;

                span.calendar-day-num {
                    &.saturday {
                        color: #144;
                    }
                    &.sunday {
                        color: #c03;
                    }
                }
            }
            &.other-month {
                color: var(--calendar-inactive-text-color);
                background-color: var(--calendar-background-color);
                height: auto;

                span.calendar-day-num {
                    &.saturday {
                        color: #6bf;
                    }
                    &.sunday {
                        color: #fa3;
                    }
                }
            }
            &.today {
                /* background-color: red; */
                background-color: #f99;
            }
        }
    }
</style>
