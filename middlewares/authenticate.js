import httpStatus from 'http-status';
import User from './../models/users.js';
import * as botService from './../services/bot.service.js';

export default async function authenticate(req, res, next) {
  const telegramId = req.body.message?.chat.id;
  const msg = req.body.message?.text;
  // If telegramId or text does not exist, it implies that
  // user has made the request to edit an old message
  if (!telegramId) {
    botService.sendMessage(req.body.edited_message.chat.id, 'Responses are not provided for edited messages.');
    res.sendStatus(httpStatus.OK);
    return;
  }
  if (msg.startsWith('/start')) return next();
  // If the msg != '/start', check if user exists
  // If yes, call next(), otherwise, block
  const user = await User.findOne({ telegram_id: telegramId });
  if (!user?.is_active) {
    botService.sendMessage(telegramId, 'Hephaestus is not active right now. Send /start command to activate.')
    res.sendStatus(httpStatus.OK);
    return;
  }
  return next();
}