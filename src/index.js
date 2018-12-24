// Load config defaults

require("dotenv").config();

const defaultConfig = require("../config.json");
const config = require("./config");

config.setDefaults(defaultConfig);

