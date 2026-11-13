// A CODING CHALLENGE entry (freeCodeCamp daily challenge). Copy this file to add
// another, then add it to the list in src/content/challenges/index.js.

import CodeBlock from '../../components/ui/CodeBlock';

export const meta = {
  id: 'freecodecamp-digital-detox', // becomes the URL: /problems/freecodecamp-digital-detox
  title: 'Digital Detox',
  description:
    'Given a log of timestamps, decide whether a screen-time goal was met. I used it to practise writing a class, including doing the calendar arithmetic by hand.',
  source: 'freeCodeCamp', // where the problem came from
  date: '2026-02-01', // YYYY-MM-DD
  tags: ['classes', 'dates', 'sorting'],
};

// The code samples, kept in template literals (backticks) so their line
// breaks and indentation are preserved exactly.
const mySolutionPython = `class DigitalDetoxTwo:
    calendar = {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
    }

    def __init__(self, logs):
        self.logs = logs

    def _is_leap_year(self, year): # checks whether true or false
        return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)

    def _months_in_days(self, month, year):
        if month == 2 and self._is_leap_year(year):
            return 29
        return self.calendar[month]

    def _parse_log(self, log):
        year = int(log[0:4])
        month = int(log[5:7])
        day = int(log[8:10])
        hour = int(log[11: 13])
        minute = int(log[14:16])
        second = int(log[17:19])
        return year, month, day, hour, minute, second

    def _days_since_origin(self, year, month, day):
        total_days = 0

        for y in range(1, year):
            if self._is_leap_year(y):
                total_days += 366
            else:
                total_days += 365

        for m in range(1, month):
            total_days += self._months_in_days(m, year)

        total_days += (day - 1)

        return total_days

    def _total_seconds(self, log):
        year, month, day, hour, minute, second = self._parse_log(log)
        total_days = self._days_since_origin(year, month, day)

        return (total_days * 24 * 3600) + (hour * 3600) + (minute * 60) + second

    def meets_goal(self):
        if len(self.logs) <= 1:
            return True

        timestamps = []
        daily_count = {}

        for log in self.logs:
            timestamps.append(self._total_seconds(log))

            date = log[:10]

            if date not in daily_count:
                daily_count[date] = 0
            daily_count[date] += 1

            if daily_count[date] > 2:
                return False

        timestamps.sort()

        four_hour_into_seconds = 4 * 3600

        for num in range(1, len(timestamps)):
            subtract = timestamps[num] - timestamps[num-1]

            if subtract < four_hour_into_seconds:
                return False
        return True


test2 = DigitalDetoxTwo(["2026-02-01 08:00:00", "2026-02-01 12:30:00"])
print(test2.meets_goal())`;

const aiSolutionPython = `FOUR_HOURS = 4 * 3600
# Days in the year before each month starts (January = 0), for a non-leap year.
DAYS_BEFORE_MONTH = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]


def is_leap_year(year):
    return (year % 4 == 0 and year % 100 != 0) or year % 400 == 0


def to_seconds(log):
    """Seconds from 0001-01-01 00:00:00 to a 'YYYY-MM-DD HH:MM:SS' timestamp."""
    year, month, day = int(log[0:4]), int(log[5:7]), int(log[8:10])
    hour, minute, second = int(log[11:13]), int(log[14:16]), int(log[17:19])

    # Whole years before this one, counted with a formula instead of a loop:
    # 365 days each, plus one for every leap year among them.
    y = year - 1
    days = y * 365 + y // 4 - y // 100 + y // 400

    days += DAYS_BEFORE_MONTH[month - 1]
    if month > 2 and is_leap_year(year):
        days += 1                      # this year's 29 February has passed
    days += day - 1

    return days * 86400 + hour * 3600 + minute * 60 + second


def meets_goal(logs):
    # Rule 1: at most two sessions on any calendar day.
    per_day = {}
    for log in logs:
        date = log[:10]
        per_day[date] = per_day.get(date, 0) + 1
        if per_day[date] > 2:
            return False

    # Rule 2: at least four hours between neighbouring sessions.
    # After sorting, the closest pair is always next to each other.
    times = sorted(to_seconds(log) for log in logs)
    for i in range(1, len(times)):
        if times[i] - times[i - 1] < FOUR_HOURS:
            return False
    return True


print(meets_goal(["2026-02-01 08:00:00", "2026-02-01 12:30:00"]))  # True`;

const aiSolutionCpp = `#include <bits/stdc++.h>
using namespace std;

const long long FOUR_HOURS = 4 * 3600;
// Days in the year before each month starts (January = 0), non-leap year.
const int DAYS_BEFORE_MONTH[12] = {0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334};

bool isLeapYear(int year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

// Seconds from 0001-01-01 00:00:00 to a "YYYY-MM-DD HH:MM:SS" timestamp.
// long long on purpose: year 2026 is about 6.4 * 10^10 seconds, past int's limit.
long long toSeconds(const string& log) {
    // substr(start, length): note: a LENGTH, not an end index like Python's slice.
    int year = stoi(log.substr(0, 4)), month = stoi(log.substr(5, 2)), day = stoi(log.substr(8, 2));
    int hour = stoi(log.substr(11, 2)), minute = stoi(log.substr(14, 2)), second = stoi(log.substr(17, 2));

    long long y = year - 1;
    long long days = y * 365 + y / 4 - y / 100 + y / 400;   // whole years, no loop
    days += DAYS_BEFORE_MONTH[month - 1];
    if (month > 2 && isLeapYear(year)) days += 1;            // 29 February has passed
    days += day - 1;

    return days * 86400 + hour * 3600 + minute * 60 + second;
}

bool meetsGoal(const vector<string>& logs) {
    // Rule 1: at most two sessions on any calendar day.
    // std::map (a balanced tree) rather than unordered_map: O(log n) per
    // lookup, but no risk of hash collisions slowing it down.
    map<string, int> perDay;
    for (const string& log : logs)
        if (++perDay[log.substr(0, 10)] > 2) return false;

    // Rule 2: at least four hours between neighbouring sessions.
    vector<long long> times;
    times.reserve(logs.size());
    for (const string& log : logs) times.push_back(toSeconds(log));
    sort(times.begin(), times.end());

    for (size_t i = 1; i < times.size(); ++i)
        if (times[i] - times[i - 1] < FOUR_HOURS) return false;
    return true;
}

int main() {
    // boolalpha prints true/false instead of 1/0.
    cout << boolalpha
         << meetsGoal({"2026-02-01 08:00:00", "2026-02-01 12:30:00"}) << '\\n';   // true
}`;

export default function FreecodecampDigitalDetox() {
  return (
    <>
      <h2>The problem</h2>

      <blockquote>
        <p>
          <strong>Digital Detox</strong> (a freeCodeCamp daily coding challenge). You are given a
          list of timestamps, each written as <code>YYYY-MM-DD HH:MM:SS</code>, one for every time
          you started a session on your phone. Decide whether you met your digital-detox goal. The
          goal is met when both of these hold: no calendar day has more than two sessions, and any
          two sessions are at least four hours apart.
        </p>
      </blockquote>

      <p>
        I could not find the original wording again, so this is the task as my solution
        implements it rather than freeCodeCamp’s exact text.
      </p>

      <h2>My solution (Python)</h2>

      <p>
        I did this one while learning <strong>classes</strong>, so I wrote it as a class on
        purpose: the logs are stored on the object in <code>__init__</code>, the small helper
        methods start with an underscore to mark them as internal, and <code>meets_goal()</code> is
        the one public method. I also avoided the <code>datetime</code> module so that I had to
        work out the calendar myself, including leap years.
      </p>

      <p>
        To compare two timestamps I turn each one into a single number: the seconds since the
        start of year 1. The gap between two sessions is then just a subtraction.
      </p>

      <CodeBlock language="python" code={mySolutionPython} />

      <p>
        I checked it against Python’s own <code>datetime</code> on 3,000 random sets of logs,
        including the leap years 2000 and 2024 and the non-leap year 2100. It gave the same
        answer every time.
      </p>

      {/* EDIT HERE: add YOUR OWN C++ solution once you've written it. */}

      <h2>AI’s solution (Python)</h2>

      <p>
        The structure is the same: convert, count per day, sort, compare neighbours. The one
        real change is in <strong>how the days are counted</strong>. My version adds up the
        years one at a time, which is about 2,025 loop steps for every single timestamp. The
        number of leap years before a given year can be worked out directly instead: one every 4
        years, minus one every 100, plus one every 400.
      </p>

      <p>
        Worked example for <code>2026-02-01 08:00:00</code>. There are 2025 whole years before
        2026. That is 2025 × 365 = 739,125 days, plus 506 − 20 + 5 = 491 leap days, making
        739,616. January adds 31 and the day of the month adds 0, so 739,647 days, plus 8 hours.
        The second log, <code>12:30:00</code> on the same day, is 4.5 hours later, or 16,200
        seconds, which is at least the 14,400 required. Two sessions that day, far enough apart:
        the goal is met.
      </p>

      <p>
        Sorting matters for the second rule. Once the times are in order, the two closest
        sessions are always next to each other, so checking each neighbouring pair is enough.
        There is no need to compare every session with every other one.
      </p>

      <CodeBlock language="python" code={aiSolutionPython} />

      <h2>AI’s solution (C++)</h2>

      <CodeBlock language="cpp" code={aiSolutionCpp} />

      <h2>Complexity</h2>

      <p>
        With <em>n</em> logs and <em>Y</em> the year number, my version is <strong>O(n·Y + n log
        n)</strong> time: the year loop runs about 2,025 times per log, then the sort. The
        formula version is <strong>O(n log n)</strong>: each conversion is a fixed handful of
        operations, and the sort is all that grows. Both use <strong>O(n)</strong> extra space
        for the list of times and the per-day counts.
      </p>

      <p>
        In numbers: for 1,000 logs my version does about 2 million loop steps before sorting,
        the formula version about 1,000 conversions, and the sort itself is around 10,000
        comparisons either way. That is a real difference in work, but for a challenge-sized
        input both answer instantly. The loop is slower but still correct.
      </p>

      <p>
        A C++ detail worth knowing: the year 2026 is about 6.4·10<sup>10</sup> seconds from year
        1, which does not fit in an <code>int</code>, so the totals are <code>long long</code>.
      </p>
    </>
  );
}
