# Refactoring SerialDate

> "Even well-written code can be improved, and the willingness to improve it separates professional developers from the rest."

## Takeaways

<pre>
First make it work correctly by fixing bugs found through tests, then clean it up.
</pre>

<pre>
Class names should be precise and descriptive. SerialDate is misleading; DayDate or OrdinalDate better conveys the intent.
</pre>

<pre>
Use enums instead of raw integer constants. They provide type safety and clarity.
</pre>

<pre>
Remove dead code. Unused methods and unreachable branches add noise and confusion.
</pre>

<pre>
Encapsulate implementation details. Users of a class should not need to know how it works internally.
</pre>

<pre>
Abstract classes should not know about their derivatives. Dependencies should point inward, not outward.
</pre>

<pre>
Move methods to where they belong. If a method uses data from another class more than its own, it likely belongs in that other class.
</pre>

<pre>
Physical and temporal dependencies between methods should be made explicit through ordering and naming.
</pre>

## Opinions

<pre>
Even well-written code can be improved, and the willingness to improve it separates professional developers from the rest.
</pre>
