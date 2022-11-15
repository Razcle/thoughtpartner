# Thought Partner for Obsidian

<p align="center" style="text-color: black;">
  <svg viewBox="0 0 24 24"  stroke-width="1.5">
        <path d="M23.251,12a3,3,0,0,0-2.183-2.886,2.249,2.249,0,0,0-1.383-3.856,2.262,2.262,0,0,0-.412-.363,3,3,0,0,0-5.46-2.478,2.25,2.25,0,0,0-3.625,0,3,3,0,0,0-5.46,2.478,2.223,2.223,0,0,0-.411.363A2.25,2.25,0,0,0,2.933,9.114a3,3,0,0,0,0,5.773,2.249,2.249,0,0,0,1.384,3.855,2.29,2.29,0,0,0,.411.363,3,3,0,0,0,5.46,2.478,2.25,2.25,0,0,0,3.625,0,3,3,0,0,0,5.46-2.478,2.223,2.223,0,0,0,.411-.363,2.248,2.248,0,0,0,1.384-3.855A3,3,0,0,0,23.251,12Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M13.5,5.25,7.59,12.132a.375.375,0,0,0,.286.618H10.5v6l5.91-6.882a.375.375,0,0,0-.285-.618H13.5Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </path> </svg>
</p>

The **Obsidian Thought Partner plugin** brings the power of GPT-3 to Obsidian.

It's aim is to not just be an easy way to generate text, but to help you think through your ideas and be a better writer.

# 1. Bring your own OpenAI key

1. Create an account on [OpenAI](https://beta.openai.com/signup) (you will get free $18 credit).

2. Click on your Account and click on View API keys

<p align="center">
  <img width="300" height="300" src="./images/20220227121447.png">
</p>

3. Generate the API key that Text Generator Plugin will use

<p align="center">
  <img width="600" height="200"src="./images/20220227121545.png">
</p>

# 2. Configure Text Generator plugin

After installing the "Text generator plugin" and enabling it, you need to provide the generated API Key to the plugin. Go to the settings in Obsidian, go to community plugins and install. After you've installed you can add your API key in settings.

## Understanding the context window

To use the plugin efficiently you need to understand the context that the AI considers.
The context that is considered can be either the selected text, or the line where the cursor is. If the line is empty, the plugin will generate text based on as much of the preceding content as possible.

## Possible commands

There are three possible commands available: "extend", "tl;dr" and "critique"

### extend

If you type `ctrl+j` then Thought Partner will take the context and try to generate the next few sentences. You can hit cntrl+j repeatedly to get more AI generated text

### tl;dr

If you `ctrl+t` then Thought Partner will create a tl;dr for the text that appears above the line where you triggered this command.

### critique

Highlight a passage of text and type `ctrl+q` and thought partner will outline possible assumptions or flaws in your reasoning.
