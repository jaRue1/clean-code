# Classes

> "The first rule of classes is that they should be small. The second rule is that they should be smaller than that."

## Takeaways

<pre>
Class organization follows a standard convention:
public static constants, then private static variables, then private instance variables,
then public functions, with private utilities just below the public function that calls them.
</pre>

<pre>
Classes should be small. But with classes we measure size by counting responsibilities, not lines of code.
</pre>

<pre>
The Single Responsibility Principle (SRP): A class should have one, and only one, reason to change.
</pre>

<pre>
Cohesion: Classes should have a small number of instance variables. Each method should manipulate one or more
of those variables. The more variables a method manipulates, the more cohesive that method is to its class.
</pre>

<pre>
When classes lose cohesion, split them. Maintaining cohesion results in many small classes.
</pre>

<pre>
Organizing for change: Classes should be open for extension but closed for modification (Open/Closed Principle).
</pre>

## Opinions

<pre>
The first rule of classes is that they should be small. The second rule is that they should be smaller than that.
</pre>

<pre>
The problem is that too many of us think we are done once the program works. We fail to switch to the other concern
of organization and cleanliness.
</pre>
