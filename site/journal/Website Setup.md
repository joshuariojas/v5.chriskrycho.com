---
title: Website Setup
subtitle: Explaining how I run this site—everything.
summary: Explaining how I run this site—everything.
date: 2020-02-09T21:00
qualifiers:
    audience: >
        People interested in the nerdy details of how to get a website like this up and running. Here I get into everything from getting a domain and setting up <abbr>DNS</abbr> to the TypeScript and templates and <abbr>CSS</abbr>!
tags:
    - web design
    - blogging
    - TypeScript
    - CSS
    - SCSS
    - HTML

---

On seeing this site relaunch back in November, my friend [John Shelton](https://sites.google.com/site/iamjohnshelton/home) asked if I had anywhere I’d listed out the whole of my setup for hosting this site. The answer is: I hadn’t, but as of *now* I have!

First up, an overview of the end-to-end stack, then a quick discussion of my costs for the site. (Also, keep your eyes open: I’m working on a post for [Mere Orthodoxy] where I walk through why I think this actually *matters*.)

[Mere Orthodoxy]: https://mereorthodoxy.com

* The domain name is registered at [Hover][Hover].
* The DNS runs through [Cloudflare.com][Cloudflare].
* The site is generated with  [11ty][11ty], with—
    * a mix of [Nunjucks], JSON, and TypeScript for the templating
    * a *very* light use of [SCSS] to generate the CSS
    * a bunch of custom filters and plugins, also written in TypeScript
* The fonts are licensed from  [Fonts.com](http://fonts.com/) (purchased and self-hosted) and  [fonts.adobe.com](http://fonts.adobe.com/) (hosted).
* The content—written entirely in [Markdown]—lives in Git repositories which I maintain on copies of on all my machines as well as on [GitHub.com][gh].
* The site is deployed via [Netlify.com][netlify].
* I actually *write* using a(n ever-changing) mix of text editors, currently primarily [1Writer] on iOS and [Byword] and [Caret] on macOS.

I should clarify, before I go any further: this is *not* a stack I would recommend to anyone else who’s not a total nerd, though this same basic *kind* of stack is workable with a much lower degree of effort than I put in. You need to be willing to do a *small* amount of semi-technical work; you *don’t* have to build an entire site from scratch like I did. The support for normal CMS interfaces to this kind of setup has grown enormously in the past few years, and it can actually be a really good, very lightweight experience.[^cms]

[Hover]: https://hover.com/
[Cloudflare]: https://cloudflare.com/
[11ty]: https://11ty.io/
[Markdown]: https://daringfireball.net/projects/markdown/
[Nunjucks]: https://mozilla.github.io/nunjucks/
[SCSS]: https://sass-lang.com
[gh]: https://github.com/chriskrycho/v5.chriskrycho.com
[netlify]: https://netlify.com/
[1Writer]: http://1writerapp.com/
[Byword]: https://www.bywordapp.com 
[Caret]:  https://caret.io/ 

*[DNS]: domain name system
*[JSON]: JavaScript Object Notation
*[SCSS]: Sassy CSS
*[CSS]: Cascading Style Sheets
*[CMS]: content management system

[^cms]: I’ve experimented a bit with both [Forestry] and [Netlify CMS]. I mentioned in my relaunch announcement post that I was leaning toward Netlify CMS because it would in principle allow me to allow *anyone* to suggest edits to my site. That didn’t end up panning out; I explain why below.

[Forestry]: https://forestry.io
[Netlify CMS]: https://www.netlifycms.org

<!-- omit in toc -->
## Outline

- [Costs](#costs)
- [Writing](#writing)
- [Workflow](#workflow)
    - [Hosting](#hosting)
    - [Deploying](#deploying)
    - [CMS](#cms)
- [Domain registration](#domain-registration)
- [DNS: Cloudflare](#dns-cloudflare)
- [Site generator](#site-generator)
- [Fonts](#fonts)

## Costs

My costs are pretty low for this setup. Cloudflare is free for setups like mine. GitHub is free for setups like mine. Netlify is free for setups like mine. The code font, [Hack][hack], is *also* free. (Sensing a theme here?)

In terms of things I *do* actually pay for (or have in the past), though:

- I pay $15/year for the domain at Hover.

- I paid a few hundred dollars to perpetually license [Sabon][sabon] (the body text) a few years ago—both for the web and for desktop work. I get [Cronos][cronos] via my $10/month for Adobe’s Lightroom package, which includes Adobe Fonts. (This is the piece here that stings the most in terms of ongoing costs, but Lightroom is *fabulous*, so I’m just rolling with it at this point.)

[hack]: https://sourcefoundry.org/hack/
[sabon]: https://www.fonts.com/font/linotype/sabon
[cronos]: https://fonts.adobe.com/fonts/cronos

## Writing

These days I do my writing in a wild hodgepodge of tools. None of them thrill me, because all of them do *some* things really well… and leave others in a “ugh, not quite there” state. For example, this particular paragraph I’m drafting in [Byword]—my old standby, an app I’ve been using for over half a decade now. It remains a rock-solid, very lightweight and very *fast* editor with just the right level of minimal Markdown support, and I love it for that. If I’m just writing a blog post like this, and I’m on macOS, Byword is still the app I’m most likely to reach for.

However, when I am working on code samples, it leaves a few things to be desired. For that, I turn to [Caret]—a more recent discovery, and one that lacks Byword’s light weight and phenomenal performance, but which is tuned to the writing *programmer*. At this point I’m using the [latest beta][caret-beta] they released… about a year ago. They’ve since [declared][caret-tweet] their intention to build something new and better using some of the same tech that underpins Caret. The *big* downside for Caret is that it’s an [Electron] app, and that means that it just *is* slower and heavier than Byword—inevitably.

Also in the “unfortunately slower than Byword” are two other tools I reach for on both macOS and iOS: [iA Writer] and [Ulysses]. Ulysses in particular I tend to reach for when working on *large projects*. So, for example, when I built out the teaching materials for [the Sunday School class I taught last summer][christology-class], I wrote the majority of it in Ulysses. It’s a much better *project*-focused writing tool than any of the others, though iA Writer has gotten much closer in the last few years. The big differentiator between iA Writer and Ulysses is that, both for good and for ill, Ulysses does more magic. You can build out a project in iA Writer, and the ways it does it works with other tools too… but you do it *manually*. Ulysses’ way of working with Markdown is much more bespoke, but it Just Works.[^just-works]

As mentioned, though, both iA Writer and Ulysses are *slower* (and just feel heavier) than I’d like. As a result, I *also* have dedicated apps I reach for on iOS for one-off posts. While I love the experience of writing in Byword there no less than I do on macOS, I pretty much never use it, for one critical reason: it doesn’t integrate nearly as nicely as some of the other options with the [document provider locations][macstories] introduced and increasingly polished in the last few versions of iOS. Instead, I end up using [1Writer] almost exclusively for one-off posts like this one. It lets me much more quickly open and interact with not only iCloud folders but—and this is the real key—Git locations exposed by [Working Copy]. (For more on this, see the next section!)

Finally, I will admit that I *do* in fact do *some* of my writing in [Visual Studio Code][vs-code]. It’s *really* not a great writing environment, but it has some really nice tools for Markdown editing. In particular, I use [an extension][all-in-one] that automates everything from generating and maintaining a table of contents (like the one above) to table formatting. It also makes for a nice environment for working with code samples.

[Byword]: https://www.bywordapp.com
[Caret]: https://caret.io
[caret-beta]: https://github.com/careteditor/releases-beta/releases
[caret-tweet]: https://twitter.com/careteditor/status/1136198029357264896?s=20
[Electron]: https://www.electronjs.org
[iA Writer]: https://ia.net/writer
[Ulysses]: https://ulysses.app
[christology-class]: https://v4.chriskrycho.com/2019/christology-god-with-us-and-for-us.html
[macstories]: https://www.macstories.net/stories/ios-11-the-macstories-review/14/
[1Writer]: http://1writerapp.com
[Working Copy]: https://workingcopyapp.com
[vs-code]: https://code.visualstudio.com
[all-in-one]: https://github.com/yzhang-gh/vscode-markdown

[^just-works]: One of the goals I have for [rewrite] is for it to *feel* as good to use as Ulysses while being as interoperable as iA Writer for project management, and as fast and lightweight as Byword. This may prove impossible… but it’s a goal.

[rewrite]: https://rewrite.software

## Workflow

My publishing work flow feels relatively straightforward to me at this point, but that’s entirely a function of the fact that I’ve been using a variant on this same approach for over half a decade now, and that it’s a *programmer’s* work flow.

### Hosting

### Deploying

### CMS

I don’t normally *need* a CMS, but I do like to have the option. Historically, there were not great options in terms of an interface for writing and managing content… unless you wanted a setup more like WordPress or Ghost: a server application with a database, and a server to run it on. I have a preference (admittedly a bit strange) for simple text files to be the “source of truth” for the content on my website.[^pdfs-etc] For the last few years, I got by managing everything just via command line tools and building everything on my home machine.

Two things have changed. First: as I noted above, I now deploy everything via Netlify, and I don’t *need* to build it on my local machine. Second, though, the last few years have seen the advent of some decent <abbr>CMS</abbr>es for statically-generated sites like this one! The two best options I found at this point are [Forestry] and [Netlify CMS]. Each has its upsides and its downsides; in the end, for these purposes, I reach for Forestry if I *really* need it… but mostly just don’t reach for either.

Forestry has far and away the better UI of the two. In fact, it has such a reasonable UI that [my friend Stephen][sc] said of it:

> Wow. I am impressed with this CMS.
> 
> It ... it makes sense. It's laid out like ... normal people would lay it out. I shouldn't be so shocked, but lo, I'm shocked.

He’s not wrong. Most CMS user interfaces are *not good*. (The best I can say for [WordPress] is that I’ve gotten used to it. [Ghost] is pretty good, but unfortunately doesn’t work for the exact workflow I described above.) That goes double for viewing them on mobile devices, and Forestry’s mobile view is actually quite god! The experience of writing in Forestry is also good, even on iOS, which is *very* unusual for web text editors—even more unusual than just working there at all. Unfortunately, though, it doesn’t support working with Git *branches*, only working with the single “master” branch of the repository. This makes it a non-starter for drafting totally new work at this point, as (at least for now) committing to `master` *publishes the post*!

Netlify CMS handles that particular problem well via its [Editorial Workflow]! However, where Forestry’s CMS UI is one of the *best* of its sort, Netlify CMS is… not. For one thing, it simply does not even try when it comes to mobile devices—not for displaying and certainly not for editing. Given that this is the context where I’m *most* apt to want a CMS, this makes it a non-starter on *that* end.

The other reason I was particularly interested in Netlify CMS is that its Editorial Workflow supports [Open Authoring], and when I was initially doing my research, I *thought* this would allow me to accept corrections from *any* user. Unfortunately, as I dug into the docs, I found my initial reading to have been wrong. In fact, it just means that—

> you can use Netlify CMS to accept contributions from GitHub users without giving them access to your repository.

This is fine so far as it goes, but if the users *already* have to be GitHub users, well… then the GitHub UI gets the job done well *enough* and doesn’t involve keeping another dependency up to date. There is a workaround using their Git Gateway workflow, but while you can restrict what kind of mischief users can get up to, it still looked like an invitation for would-be makers-of-mayhem to make for a very annoying day.[^obnoxious] As such I just ended up making the links for editing a post take users straight to GitHub. It’s not perfect, but it’s good enough.

The net of all of this is that I had Forestry enabled for a while but eventually removed it. My Git-based workflow works well *enough* from any device, and works better than any CMS option I tried, that it wasn’t worth the hassle (however small). If you know of other good headless CMS systems which can just slot into this kind of Git-based workflow, I’d actually love to hear about them! I may or may not end up reaching for them with *this* site, but I run other sites in relatively similar ways, and it would be nice for *those*.

[WordPress]: http://wordpress.org
[Ghost]: https://ghost.org
[sc]: https://stephencarradini.com
[Editorial Workflow]: https://www.netlifycms.org/docs/configuration-options/#publish-mode
[Open Authoring]: https://www.netlifycms.org/docs/open-authoring/

[^pdfs-etc]: I like being able to generate things which *aren’t* web pages from my content sometimes!

[^obnoxious]: Internet users can be obnoxious. When one of my posts hit the top of Hacker News a few months ago, I had people “signing up” for [rewrite] updates with email addresses—I kid you not—like `dont-be-arrogant@rewrite.software` and `dont-advertise-your-own-software@chriskrycho.com`. Dumb? Very. The internet is *full* of dumb.

*[UI]: user interface

## Domain registration

## DNS: Cloudflare

I just switched all of my DNS name servers to [Cloudflare] earlier this year. I had a longstanding goal of having my registration, my name servers, and my actual hosting and deployment in separate places for a few years now. I don’t remember where I first ran into the idea of keeping those separate, but it stuck—forcefully, by dint of experience.

At one point I was managing all three—registration, name servers, and hosting—through an old-school shared hosting provider ([Stablehost], still a pretty solid option in that space!)… and migrating *out* of that provider was incredibly painful. (It’s actually not 100% done! The hard parts are all done now, though, which is a relief.)

After doing a bunch of research back in late June, I migrated all of my DNS to Cloudflare. *All* of it. This took [a fair bit of work][rewrites] but it has made everything else since then *much* easier. Their domain name management control panel is really good—as good as any I’ve used—and in my experience it’s also incredibly *fast* to propagate the information around the web. That latter bit is particularly pleasant and important, as anyone who has ever had to mess with DNS knows!

<aside>

If you’re curious: yes, I *do* have thoughts on Cloudflare’s approach to deciding who to leave on the internet and who to kick off the internet, but I’ll save those for another day.

</aside>

[Stablehost]: https://www.stablehost.com
[rewrites]: https://v4.chriskrycho.com/2019/my-final-round-of-url-rewrites-ever.html

## Site generator

## Fonts