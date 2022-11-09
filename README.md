# Obsidian Thought Partner

The **Obsidian Thought Partner plugin** is a handy tool that can help you generate text content using the powerful language model GPT-3 directly.

> To use Text generator you need to:
>
> -   01 Get an API Key (create an account at OpenAI)
> -   02 Configure the plugin's setting to use API Key.

# 01 Create an account at OpenAI

To generate Open AI API Key.  Follow  the following steps:

1. Create an account on [OpenAI](https://beta.openai.com/signup) (you will get a free 18$ trial account).

2. Click on your Account and click on View API keys

<p align="center">
  <img width="300" height="300" src="./images/20220227121447.png">
</p>

3. Generate the API key that Text Generator Plugin will use

<p align="center">
  <img width="600" height="200"src="./images/20220227121545.png">
</p>


# 02 Configure Text Generator plugin

After installing the "Text generator plugin" and enabling it, you need to provide the generated API Key to the plugin. Go to the settings in Obsidian, go to community plugins and install. After you've installed you can add your API key in settings.

## Considered Content

To use the plugin efficiently you need to understand the context that the AI considers.
The context that is considered can be either the selected text, or the line where the cursor is. If the line is empty, the plugin will generate text based on as much of the preciding content as possible.

## Possible commands

There are three possible commands available: "extend", "tl;dr" and "critique"

### extend

If you type ctrl+j then Thought Partner will take the context and try to generate the next few sentences. You can hit cntrl+j repeatedly to get more AI generated text

### tl;dr

If you ctrl+t then Thought Partner will create a tl;dr for the text that appears above the line where you triggered this command.

### critique

Highlight a passage of text and type ctrl+q and thought partner will outline possible assumptions or flaws in your reasoning.
