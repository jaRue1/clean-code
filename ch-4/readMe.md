# Comments

> Don't comment bad code; rewrite it.

## Takeaways

<pre>
Comments are a necessary evil.

The proper use of comments is to compensate for our failure to express ourselves in code.
A comment is a failure to express yourself in code.
</pre>

<pre>
Comments lie. Not always, and not intentionally, but too often.

The older a comment is, and the farther away it is from the code it describes, the more likely it is to be wrong.
</pre>

<pre>
Truth can only be found in one place: the code.
</pre>

<pre>
Good Comments:

1. Legal comments (copyright, license headers)
2. Informative comments (clarifying a regex or return value)
3. Explanation of intent (why a decision was made)
4. TODO comments (reminders for future work)
5. Warning of consequences (explain why something should not be changed)
6. Amplification (emphasize importance of something that seems inconsequential)
</pre>

<pre>
Bad Comments:

1. Redundant comments (comment restates the code)
2. Misleading comments (comment is not precise enough, or is outright wrong)
3. Journal comments (changelog entries at the top of files; use source control instead)
4. Noise comments (restate the obvious, provide no new information)
5. Closing brace comments (if you need these, your function is too long)
6. Attribution comments (who wrote this; source control tracks this)
7. Commented-out code (delete it; source control remembers it)
8. Mandated comments (javadoc for every function is clutter, not clarity)
</pre>

<pre>
A well-chosen name for a small function that does one thing is usually better than a comment header.

Don't use a comment when you can use a function or a variable.
</pre>

<pre>
If you find yourself wanting to write a comment, first try to refactor the code so that the comment becomes unnecessary.
</pre>

## Opinions

<pre>
Truth can only be found in the code itself. Only the code can truly tell you what it does.
Comments are, at best, a necessary evil.
</pre>

<pre>
Inaccurate comments are far worse than no comments at all.
They set expectations that will never be fulfilled. They lay down old rules that need not, and should not, be followed.
</pre>
