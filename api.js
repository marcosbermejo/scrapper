require('dotenv').config();
const cheerio = require('cheerio');
const axios = require('axios');
const express = require('express');
const logger = require('./logger');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors())

String.prototype.clean = function () {
  return this.trim().replace(/\t/g, '').replace(/\n/g, '');
};

function getJustText(el) {
  return el.clone().children().remove().end().text().clean();;
}


app.get('/club/:clubId', async (req, res) => {
  const { clubId } = req.params;
  if (!clubId || isNaN(clubId)) return res.status(400).send('Params error');

  try {
    const { data: info } = await axios.get(`${process.env.URL}/club/${clubId}`);
    const $ = cheerio.load(info);

    const data = $('.club-content .col-sm-4 > div').map(function () {
      const label = $(this).find('div').text().clean();
      const value = getJustText($(this))
      return { label, value }
    }).toArray();

    res.json(data)

  } catch (error) {
    logger.error('System Error: ' + error.message);
    res.status(500).send('System Error');
  }
})

app.get('/tournament/:tournamentId/match/:matchId', async (req, res) => {

  const { tournamentId, matchId } = req.params;
  if (!tournamentId || !matchId || isNaN(tournamentId) || isNaN(matchId)) return res.status(400).send('Params error');

  try {
    const { data: scoring } = await axios.get(`${process.env.URL}/tournament/${tournamentId}/match/${matchId}/live-scoring`);
    const $ = cheerio.load(scoring);
  
    const data = $("#edit-match").find(".incidence").map(function () {
      const team = $(this).hasClass('left') ? 'first' : 'second';
      const result = $(this).find('.bubble strong').text().clean();
      const minute = $(this).find('.bubble').text().clean().replace(result, '');
      const number = $(this).find('.strong.ellipsis span').text().clean();
      const player = $(this).find('.strong.ellipsis').text().clean().replace(number, '');
      const text = $(this).find('.strong.ellipsis').next('div').text().clean();
      return { team, result, minute, number, player, text };
    }).toArray();

    res.json(data);

  } catch (error) {
    logger.error('System Error: ' + error.message);
    res.status(500).send('System Error');
  }
})

app.listen(port);