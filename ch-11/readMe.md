# Systems

> "Software systems should separate the startup process from the runtime logic."

## Takeaways

<pre>
Separate constructing a system from using it. The startup process is a concern that any application must address,
and it should be separated from the runtime logic.
</pre>

<pre>
Dependency Injection: Give objects their dependencies rather than having them create or find their own dependencies.
This is a powerful mechanism for separating construction from use.
</pre>

<pre>
Scaling up: Start simple, then refactor and expand as needed. It is a myth that we can get systems right the first time.
We should implement only today's requirements, then refactor tomorrow.
</pre>

<pre>
Use standards wisely: Do not over-architect. Standards make it easier to reuse ideas and components, but the process
of creating them can sometimes take too long for the market to wait.
</pre>

<pre>
Systems need domain-specific languages. A good DSL minimizes the communication gap between a domain concept
and the code that implements it.
</pre>

## Opinions

<pre>
Software systems should separate the startup process from the runtime logic.
</pre>

<pre>
Whether you are designing systems or individual modules, never forget to use the simplest thing that can possibly work.
</pre>
