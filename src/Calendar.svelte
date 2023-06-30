<svelte:options customElement="my-calendar" />

<script>
    import moment from "moment";
    import { onMount, onDestroy } from "svelte";

    let theme = "light";

    function setThemeFromHTML() {
        theme = document.documentElement.getAttribute("data-theme") || "light";
    }

    function observeThemeChanges() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === "data-theme") {
                    setThemeFromHTML();
                }
            }
        });

        observer.observe(document.documentElement, { attributes: true });
    }

    export let yearRangeBefore = 2;
    export let yearRangeAfter = 1;

    let selectorYear, selectorMonth;

    const calendarData = {
        selectedYear: 0,
        selectedMonth: 0,
        weekNames: [],
        years: [],
        months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        days: [],
    };

    const setupSelectorYears = (date) => {
        calendarData.selectedYear = parseInt(moment(date).format("YYYY"));
        const beginYear = calendarData.selectedYear - yearRangeBefore;
        const endYear = calendarData.selectedYear + yearRangeAfter;

        calendarData.years = [];
        for (let i = beginYear; i <= endYear; i++) {
            calendarData.years.push(i);
        }
    };

    const setupSelectorMonths = (date) => {
        calendarData.selectedMonth = parseInt(moment(date).format("MM"));

        calendarData.months = [];
        for (let i = 1; i <= 12; i++) {
            calendarData.months.push(i);
        }
    };

    const moveToday = () => {
        const today = moment();
        setupDays(today);
    };

    const movePreviousMonth = (wtf) => {
        const ym = `${calendarData.selectedYear}-${calendarData.selectedMonth}`;
        const previousMonth = moment(ym, "YYYY-MM").subtract(1, "month");
        setupDays(previousMonth);
    };

    const moveNextMonth = () => {
        const ym = `${calendarData.selectedYear}-${calendarData.selectedMonth}`;
        const nextMonth = moment(ym, "YYYY-MM").add(1, "month");
        setupDays(nextMonth);
    };

    const moveDateBySelector = () => {
        if (selectorYear && selectorMonth) {
            calendarData.selectedYear = parseInt(selectorYear.value);
            calendarData.selectedMonth = parseInt(selectorMonth.value);

            const ym = `${calendarData.selectedYear}-${calendarData.selectedMonth}`;
            const selectedYearMonth = moment(ym, "YYYY-MM");
            setupDays(selectedYearMonth);
        }
    };

    const setupDays = (referenceDate) => {
        const weekNames = moment.weekdaysShort(true);
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
            });
            day.add(1, "day");
        }
    };

    onMount(() => {
        setThemeFromHTML();
        observeThemeChanges();

        moment.locale("ko");
        const today = moment();

        setupSelectorYears(today);
        setupSelectorMonths(today);
        setupDays(today);
    });

    onDestroy(() => {
        observer.disconnect();
    });
</script>

<div class="calendar-container" data-theme={theme}>
    <link rel="stylesheet" href="global.css" />
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

        <button on:click={() => moveToday()}>Today</button>
        <button on:click={movePreviousMonth}> Previous Month </button>
        <button on:click={moveNextMonth}> Next Month </button>
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
                    class="
                    calendar-day
                    {day.isCurrentMonth ? 'current-month' : 'other-month'}
                    {day.isToday ? 'today' : ''}"
                >
                    <div class="calendar-day-container">
                        <span class="calendar-day-num">{day.num}</span>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
</div>

<style>
    :host {
        --calendar-active-text-color: #444;
        --calendar-inactive-text-color: #aaa;
        --calendar-background-color: #fff;
        --calendar-border-color: #ddd;
    }

    [data-theme="dark"] {
        --calendar-active-text-color: #fff;
        --calendar-inactive-text-color: #aaa;
        --calendar-background-color: #444;
        --calendar-border-color: #555;
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
    }

    select:hover {
        border-color: var(--calendar-active-text-color);
    }

    div.calendar-container {
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
        height: 4rem;
        list-style: none;
    }

    ul.calendar-weekdays li {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-size: 1.5rem;
        font-weight: bold;
    }

    ul.calendar-days {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
        height: calc(100% - 4.5rem);
        list-style: none;
    }

    ul.calendar-days > li {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: calc(100% / 7);
    }

    ul.calendar-days > li > div {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: calc(100% - 0.22rem);
        height: calc(100% - 0.22rem);
        border: 0.01rem solid var(--calendar-border-color);
        padding: 0.2rem;
        font-size: 1.5rem;
    }

    ul.calendar-days > li:hover {
        background-color: rgba(80, 170, 170, 0.3) !important;
    }

    ul.calendar-days > li.current-month {
        color: var(--calendar-active-text-color);
        background-color: var(--calendar-background-color);
        height: auto;
    }

    ul.calendar-days > li.other-month {
        color: var(--calendar-inactive-text-color);
        background-color: var(--calendar-background-color);
        height: auto;
    }

    ul.calendar-days > li.today {
        /* background-color: red; */
        background-color: rgba(230, 110, 110, 0.3);
    }

    span.calendar-day-num {
        width: 100%;
        align-self: normal;
        text-align: right;
    }
</style>
