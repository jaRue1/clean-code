# Smells and Heuristics

> "Clean code is not written by following a set of rules. You don't become a software craftsman by learning a list of heuristics. Professionalism and craftsmanship come from values that drive disciplines."

## Takeaways

<pre>
Comments: Avoid inappropriate info, obsolete comments, redundant comments, poorly written comments, and commented-out code. If a comment is needed, make it count.
</pre>

<pre>
Environment: The build should require no more than one step. Tests should require no more than one step.
</pre>

<pre>
Functions: Avoid too many arguments, output arguments, flag arguments, and dead functions. Functions should do one thing.
</pre>

<pre>
General: Avoid multiple languages in one file. Implement obvious behavior. Handle boundary conditions correctly. Eliminate duplication. Keep code at the right level of abstraction. Base classes must not depend on derivatives. Minimize information exposure. Remove dead code. Reduce vertical separation. Maintain consistency. Remove clutter. Avoid feature envy. Avoid selector arguments. Do not obscure intent. Place responsibility correctly. Avoid inappropriate statics. Use explanatory variables. Name functions to say what they do. Understand the algorithm. Make logical dependencies physical. Prefer polymorphism to if/else or switch/case chains. Follow standard conventions. Replace magic numbers with named constants. Be precise. Prefer structure over convention. Encapsulate conditionals. Avoid negative conditionals. Functions should do one thing. Do not be arbitrary. Encapsulate boundary conditions. Keep configurable data at high levels.
</pre>

<pre>
Names: Choose descriptive names. Choose names at the appropriate level of abstraction. Use standard nomenclature where it exists. Use long names for long scopes.
</pre>

<pre>
Tests: Write sufficient tests. Use a coverage tool. Do not skip trivial tests. Test boundary conditions. Exhaustively test near bugs. Look for patterns of failure. Tests should be fast.
</pre>

## Opinions

<pre>
Clean code is not written by following a set of rules. You don't become a software craftsman by learning a list of heuristics. Professionalism and craftsmanship come from values that drive disciplines.
</pre>
