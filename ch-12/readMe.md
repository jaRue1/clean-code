# Emergence

> "Following the practice of simple design can encourage and enable developers to adhere to good principles and patterns."

## Takeaways

<pre>
Kent Beck's four rules of simple design (in priority order):
1. Runs all the tests
2. Contains no duplication
3. Expresses the intent of the programmer
4. Minimizes the number of classes and methods
</pre>

<pre>
A system that is comprehensively tested and passes all of its tests all of the time is a testable system. Systems that are not testable are not verifiable. A system that cannot be verified should never be deployed.
</pre>

<pre>
Once we have tests, we are empowered to keep our code and classes clean. We do this by incrementally refactoring the code. With tests in place, you can clean up freely without fear of breaking things.
</pre>

<pre>
Duplication is the primary enemy of a well-designed system. It represents additional work, additional risk, and additional unnecessary complexity. Duplication manifests itself in many forms: identical code, similar implementations, and duplication of intent.
</pre>

<pre>
Expressiveness: choose good names, keep functions and classes small, use standard nomenclature (design patterns), and write well-crafted unit tests. The most important way to be expressive is to try.
</pre>

<pre>
Minimal classes and methods is the lowest priority of the four rules. Do not take Single Responsibility Principle too far by creating too many tiny classes and methods. Be pragmatic. Keep class and function counts low while keeping everything else high.
</pre>

## Opinions

<pre>
Following the practice of simple design can encourage and enable developers to adhere to good principles and patterns that otherwise take years to learn.
</pre>

<pre>
The majority of the cost of a software project is in long-term maintenance. The clearer the author can make the code, the less time others will have to spend understanding it.
</pre>

<pre>
Making sure the system is trivial to verify pushes us toward a design where our classes are small and single-purpose, which makes design itself easier.
</pre>
