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
                day: day.format("D"),
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
            on:change={moveDateBySelector}
            bind:this={selectorYear}
            bind:value={calendarData.selectedYear}
        >
            {#each calendarData.years as year}
                <option value={year}>{year}</option>
            {/each}
        </select>

        <select
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
                    <span class="calendar-day-num">{day.day}</span>
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
    }

    [data-theme="dark"] {
        --calendar-active-text-color: #fff;
        --calendar-inactive-text-color: #aaa;
        --calendar-background-color: #444;
    }

    div.calendar-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        min-width: 70rem;
        height: 100%;
        overflow: auto;
    }

    div.calendar-controls {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        /* height: 100px; */
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
        height: 10%;
        list-style: none;
        padding: 0;
        margin: 0;
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
        height: 90%;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    ul.calendar-days > li {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 14%;
        font-size: 1.5rem;
        /* font-weight: bold; */
    }

    ul.calendar-days > li:hover {
        background-color: #44888c !important;
    }

    ul.calendar-days li.current-month {
        color: var(--calendar-active-text-color);
        background-color: var(--calendar-background-color);
        height: auto;
        margin-right: 0.2rem;
        margin-bottom: 0.2rem;
    }

    ul.calendar-days li.other-month {
        color: var(--calendar-inactive-text-color);
        background-color: var(--calendar-background-color);
        height: auto;
        margin-right: 0.2rem;
        margin-bottom: 0.2rem;
    }

    ul.calendar-days li.today {
        background-color: red;
    }

    span.calendar-day-num {
        width: 100%;
        align-self: normal;
        text-align: right;
    }
</style>
