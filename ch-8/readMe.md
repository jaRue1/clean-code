# Boundaries

> "Code at the boundaries needs clear separation and tests that define expectations."

## Takeaways

<pre>
Using third-party code: wrap third-party interfaces behind your own classes. This limits the surface area of your dependency and makes it easier to change later.
</pre>

<pre>
Exploring and learning boundaries: write learning tests to explore the behavior of third-party code. They verify your understanding and serve as documentation.
</pre>

<pre>
Learning tests are better than free. They cost nothing extra, and when the third-party library releases a new version, you run your learning tests to see if there are behavioral differences.
</pre>

<pre>
Using code that does not exist yet: when a boundary API has not been designed or delivered, define your own interface that describes what you need. Adapt it later when the real API arrives.
</pre>

<pre>
Clean boundaries: depend on things you control, not on things you do not. Wrap external APIs so the rest of your system is insulated from changes.
</pre>

## Opinions

<pre>
Code at the boundaries needs clear separation and tests that define expectations.
</pre>

<pre>
It is better to depend on something you control than on something you do not control, lest it end up controlling you.
</pre>
