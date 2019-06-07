# Quick Yeoman generator run-loop cheatsheet

See [Generator Runtime Context](https://yeoman.io/authoring/running-context.html) for more information.

---

<!-- MarkdownTOC -->

1. [Step 1) INITIALIZING](#step-1-initializing)
1. [Step 2) PROMPTING](#step-2-prompting)
1. [Step 3) CONFIGURING](#step-3-configuring)
1. [Step 4) DEFAULT](#step-4-default)
1. [Step 5) WRITING](#step-5-writing)
1. [Step 6) CONFLICTS](#step-6-conflicts)
1. [Step 7) INSTALL](#step-7-install)
1. [Step 8) END](#step-8-end)

<!-- /MarkdownTOC -->

## Step 1) INITIALIZING

-   Your initialization methods (checking current project state, getting configs, etc)

## Step 2) PROMPTING

-   Where you prompt users for options (where you’d call this.prompt())
-   @NOTE: this.prompt() can be called in other places too

## Step 3) CONFIGURING

-   Saving configurations and configure the project (creating .editorconfig files and other metadata files)

## Step 4) DEFAULT

-   If the method name doesn’t match a priority, it will be pushed to this group.

## Step 5) WRITING

-   Where you write the generator specific files (routes, controllers, etc)

## Step 6) CONFLICTS

-   Where conflicts are handled (used internally)

## Step 7) INSTALL

-   Where installations are run (npm, yarn, bower)
-   No matter how many generators are linked, or how many install calls in methods, Yeoman collects & calls install once

## Step 8) END

-   Called last, cleanup, say good bye, etc


