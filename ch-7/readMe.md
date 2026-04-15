# Error Handling

> "Error handling is important, but if it obscures logic, it's wrong."

## Takeaways

<pre>
Use exceptions rather than return codes. Exceptions separate the happy path from error handling, making both easier to read.
</pre>

<pre>
Write your try-catch-finally statement first. This helps define the scope and expectations for the code that follows.
</pre>

<pre>
Use unchecked exceptions. The cost of checked exceptions is a violation of the Open/Closed Principle; a change in a low-level function forces signature changes on many higher levels.
</pre>

<pre>
Provide context with exceptions. Create informative error messages that describe the operation that failed and the type of failure.
</pre>

<pre>
Define exception classes in terms of a caller's needs. Wrap third-party APIs so you can consolidate multiple exception types into a single, meaningful exception.
</pre>

<pre>
Don't return null. Returning null forces callers to check for null constantly. Return empty collections, throw exceptions, or use special case objects instead.
</pre>

<pre>
Don't pass null. Passing null into methods is worse than returning it. It leads to runtime NullPointerExceptions and forces every function to guard against null arguments.
</pre>

## Opinions

<pre>
Error handling is important, but if it obscures logic, it's wrong.
</pre>

<pre>
If you are tempted to return null from a method, consider throwing an exception or returning a special case object instead.
</pre>
