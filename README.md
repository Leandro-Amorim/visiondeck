<h1 align="center">

  ![screenshot](https://raw.githubusercontent.com/Leandro-Amorim/visiondeck/main/images/video.webm)

  VisionDeck
  <br>
</h1>

<h4 align="center">An autonomous Poker Bot (more specifically for the Deuces Wild variant) powered by Computer Vision and AI.</h4>

> **Note:**
> Warning: This software was developed as a proof of concept for educational purposes. Do not try to use it in real situations or you will end up in trouble.

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#setup">Setup</a> •
  <a href="#credits">Credits</a> •
  <a href="#donate">Donate</a> •
  <a href="#license">License</a>
</p>

## Key Features

* Autonomous operation powered by Playwright

* Card identification algorithm using OpenCV

* 2 operation modes: Internal logic (roughly based on [Not So Ugly Ducks Strategy by Wizard of Odds](https://wizardofodds.com/games/video-poker/strategy/deuces-wild/not-so-ugly-ducks/); may have some flaws as I'm not a poker expert) and AI solving (OpenAI or Anthropic)

## Setup

### Prerequisites

Make sure you have a working installation of [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/). You will also need the API key of an AI provider if you want to use AI mode.

### Environment Variables

| **Variable**      | **Description**                                                                              |
|-------------------|----------------------------------------------------------------------------------------------|
| AI_MODE           | Whether to use an AI provider to solve the poker hand. Defaults to ``false``.                |
| AI_PROVIDER       | Which AI provider to use if using AI mode. Possible values are ``openai`` and ``anthropic``. |
| ANTHROPIC_API_KEY | API key to use if the provider is Anthropic.                                                 |
| OPENAI_API_KEY    | API key to use if the provider is OpenAI.                                                    |

### Step by step

* From your command line:

```bash
# Clone this repository
$ git clone https://github.com/Leandro-Amorim/visiondeck

# Go into the repository
$ cd visiondeck

# Install dependencies
$ npm install

# Run the app
$ npm run dev
```

* Follow the instructions listed on the screen (keep the canvas fully on the screen, select the "Deuces Wild" variant and wait for the "Press Deal to Start" message to appear).

* If you ever need to regenerate the training data, you can do so by adding the card images to the ``unprocessed-cards`` folder and running the command:

```bash
# Regenerate training data
$ npm run process
```

Make sure you follow the naming of the files already in the folder.

## Credits

* ['Not So Ugly Ducks' Deuces Wild Strategy](https://wizardofodds.com/games/video-poker/strategy/deuces-wild/not-so-ugly-ducks/) by Wizard of Odds
* [OpenCV-Playing-Card-Detector](https://github.com/EdjeElectronics/OpenCV-Playing-Card-Detector)
* [OpenCV](https://opencv.org/)
* [Playwright](https://playwright.dev/)
* [Node.js](https://nodejs.org/en)

## Donate

If you think this project has helped you in any way or you've learned something new, consider buying me a coffee, I love it!

<a href="https://www.buymeacoffee.com/leandro.n.amorim" target="_blank"><img src="https://raw.githubusercontent.com/Leandro-Amorim/supafy/main/setup/img/coffee.png" alt="Buy Me A Coffee"></a>

## License

Distributed under the MIT License. See ``LICENSE.txt`` for more information.
