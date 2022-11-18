# ThoughtPartner for Obsidian

<p align="center">
  <img height="300" src="./images/DALL·E 2022-11-18 15.26.54 - thought partner svg line logo symmetric.png">
</p>

The **Obsidian Thought Partner plugin** brings the power of GPT-3 to Obsidian.

It's aim is to not just be an easy way to generate text, but to help you think through your ideas and be a better writer.

# Installation

## 1. Manually install the pluging

Download the zip of this repo and unzip it into your vault's `<vault>/.obsidian/plugins/` folder, then reload Obsidian.
Note: the .obsidian folder may be hidden. On MacOS you should be able to press Command+Shift+Dot to show the folder in Finder.

## 2. Bring your own OpenAI key

Thought Partner uses GPT-3. It's free, you'll just pay (the very reasonable) cost of the tokens to GPT-3 (and you'll have $18 of free credit).

1. Create an account on [OpenAI](https://beta.openai.com/signup)

2. Grab your API key from [https://beta.openai.com/account/api-keys](https://beta.openai.com/account/api-keys)

3. Paste your API key into the plugin settings

After installing and enabling the ThoughtPartner plugin, go to the settings in Obsidian and add your API key in settings.

<p align="center">
  <img height="300" src="./images/setings.png">
</p>

# Usage Guide

### Understanding the context window

To use the plugin efficiently you need to understand the context that the AI considers.
The context that is considered can be either the selected text, or the line where the cursor is. If the line is empty, the plugin will generate text based on as much of the preceding content as possible.

### Possible commands

There are three possible commands available: "extend", "tl;dr" and "critique"

#### extend

If you type `ctrl+j` then Thought Partner will take the context and try to generate the next few sentences. You can hit cntrl+j repeatedly to get more AI generated text

#### tldr

If you `ctrl+t` then Thought Partner will create a tl;dr for the text that appears above the line where you triggered this command.

#### critique

Highlight a passage of text and type `ctrl+q` and thought partner will outline possible assumptions or flaws in your reasoning.

# Data privacy

See OpenAI's [privacy policy](https://openai.com/api/policies/terms/) for more information of how th
https://openai.com/api/policies/terms/
