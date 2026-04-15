# Concurrency

> "Objects are abstractions of processing. Threads are abstractions of schedule."

## Takeaways

<pre>
Concurrency is hard. Even for simple problems, concurrency can lead to surprising and subtle bugs that may not reveal themselves until systems are under significant load.
</pre>

<pre>
Concurrency Defense Principle: Single Responsibility. Keep your concurrency-related code separate from other code. Concurrency design is complex enough to be a reason to change on its own, and has its own lifecycle of development, change, and tuning.
</pre>

<pre>
Limit the scope of shared data. Take data encapsulation to heart. Severely limit the access of any data that may be shared. Use synchronized access to protect shared mutable state.
</pre>

<pre>
Use copies of data. Avoid sharing data in the first place. Copy objects and treat them as read-only. Merge results from multiple threads into a single result in a single thread.
</pre>

<pre>
Threads should be as independent as possible. Attempt to partition data into independent subsets that can be operated on by independent threads, each in its own world, sharing no data with any other thread.
</pre>

<pre>
Know your library's thread-safe collections. Use concurrent collections when possible, and know the execution models: Producer-Consumer, Readers-Writers, and Dining Philosophers.
</pre>

<pre>
Keep synchronized sections small. Locks are expensive and add overhead. Design your code so that the critical sections (the code that must be synchronized) are as small as possible.
</pre>

<pre>
Think about shut-down early. Graceful shutdown can be hard to get right. Think about it from the beginning and get it working early, because it is going to take longer than you expect.
</pre>

<pre>
Test threaded code. Write tests that have the potential to expose problems and then run them frequently, with different configurations and loads. Do not ignore failures in threaded tests: one-offs may be real concurrency bugs.
</pre>

## Opinions

<pre>
Concurrency bugs aren't repeatable, so they are often ignored as one-offs instead of the true defects they are.
</pre>

<pre>
Concurrency can sometimes improve performance, but only when there is a lot of wait time that can be shared between multiple threads or processors. Neither situation is trivial.
</pre>

<pre>
The best approach is to assume that concurrency-related bugs exist and go after them with discipline rather than waiting for them to surface in production.
</pre>
