# Formatting

> Code formatting is about communication, and communication is the professional developer's first order of business.

## Takeaways

<pre>
The Newspaper Metaphor:

Think of a source file like a newspaper article. The name should be simple but explanatory.
The topmost parts should provide the high-level concepts and algorithms.
Detail should increase as we move downward, until at the end we find the lowest level functions and details.
</pre>

<pre>
Vertical Openness Between Concepts:

Each blank line is a visual cue that identifies a new and separate concept.
Each group of lines represents a complete thought. Those thoughts should be separated from each other with blank lines.
</pre>

<pre>
Vertical Density:

Lines of code that are tightly related should appear vertically dense.
Useless comments between closely related lines break the intimate connection.
</pre>

<pre>
Vertical Distance:

Concepts that are closely related should be kept vertically close to each other.

Variables should be declared as close to their usage as possible.
Instance variables should be declared at the top of the class.
Dependent functions: if one function calls another, they should be vertically close, and the caller should be above the callee.
</pre>

<pre>
Horizontal Formatting:

Keep lines short. You should never have to scroll to the right.
Use horizontal whitespace to associate things that are related and disassociate things that are not.
</pre>

<pre>
Team Rules:

A team of developers should agree upon a single formatting style, and then every member of that team should use that style.
A good software system is composed of a set of documents that read nicely. They need to have a consistent and smooth style.
</pre>

<pre>
Vertical Ordering:

Function call dependencies should point in the downward direction.
A function that is called should be below a function that does the calling.
This creates a nice flow from high level to low level.
</pre>

## Opinions

<pre>
Code formatting is about communication, and communication is the professional developer's first order of business.
The functionality you create today has a good chance of changing in the next release, but the readability of your code will have a profound effect on all the changes that will ever be made.
</pre>

<pre>
Perhaps you thought that "getting it working" was the first order of business for a professional developer.
Not so. Communication is.
</pre>
