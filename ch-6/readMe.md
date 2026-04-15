# Objects and Data Structures

> "Objects hide their data behind abstractions and expose functions that operate on that data. Data structures expose their data and have no meaningful functions."

## Takeaways

<pre>
Data abstraction: hide implementation details behind a meaningful interface rather than exposing raw fields.
</pre>

<pre>
Data/Object anti-symmetry: objects hide data and expose behavior; data structures expose data and have no behavior. They are virtual opposites.
</pre>

<pre>
Procedural code (using data structures) makes it easy to add new functions without changing existing data structures. OO code makes it easy to add new classes without changing existing functions.
</pre>

<pre>
The Law of Demeter: a method should only call methods on its immediate collaborators. Do not talk to strangers; a.getB().getC().doSomething() is a violation.
</pre>

<pre>
Train wrecks: chains of method calls like a.getB().getC().doSomething() should be avoided. They tightly couple the caller to the internal structure of objects it should not know about.
</pre>

<pre>
DTOs (Data Transfer Objects) are data structures with public variables and no functions. They are useful for communicating with databases or parsing messages from sockets.
</pre>

<pre>
Active Records are DTOs with navigational methods like save and find. Treat them as data structures; do not put business logic in them.
</pre>

## Opinions

<pre>
Objects expose behavior and hide data. Data structures expose data and have no significant behavior.
</pre>

<pre>
Mature programmers know that the idea that everything is an object is a myth. Sometimes you really do want simple data structures with procedures operating on them.
</pre>
