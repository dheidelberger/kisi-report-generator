# Kisi Report Generator

This web app generates day-by-day attendance reports based on the output of a Kisi event log. This log can be a horrendously confusing and convoluted .csv file (often with 1000s of rows per day, even for a small organization), so this site aims to extract only the useful unlock information from the log and put it in a readable report from.

This app is live at [kisireportgenerator.com](https://www.kisireportgenerator.com). If all you want to do is use the tool, you should go there. If you want to fork or develop it, you've come to the right place!

## Getting Started

This project requires [NodeJS](https://www.nodejs.org/) and NPM. It is built with the [Vue.js](https://www.vuejs.org/) web framework.

Fork or clone this repository to get started. Navigate to the project directory and then install the dependencies using your command line:

```bash
npm install
```

To run the app with [hot module replacement](https://webpack.js.org/concepts/hot-module-replacement/), type the following on your command line:

```bash
npm run serve
```

You should then be able to navigate to [http://localhost:8080](http://localhost:8080) and run the project. This sorcery is part of the [Vue CLI Service](https://cli.vuejs.org/guide/cli-service.html#using-the-binary).

To build the project, you'll want to run the following:

```bash
npm run build
```

## To-Do

The code isn't particularly well commented, I need to do more of that. I also haven't put too much thought into dealing with timezones. For now, I'm assuming that the report is being generated in the same timezone as the door that's being unlocked. I realize that won't be the case for some organizations. I'm also not entirely sure how Kisi deals with multiple timezones in its event logs. If this is a feature you're interested in and you have an event log with multiple timezones in it, I'd be interested in seeing it to explore the feasibility of adding this.

## Contributing

Feel free to submit a pull request to improve the code. I'm relatively new with Vue, so I'm sure I'm doing a lot wrong. I'd love to be corrected!

## Credits

This project is written and maintained by [David Heidelberger](http://www.davidheidelberger.com). I'm a full-time video editor and producer and part-time software developer. I use this tool and many other proprietary ones every day at my day job on a documentary series on PBS. I'm available for workflow consultation and custom software solutions for your post-production workflow. To get in touch about a consult, or just to tell me how you're using the app, I'd love to [hear from you](mailto:david.heidelberger@gmail.com).

The icon was based on an icon at [icons8.com](https://www.icons8.com/).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
