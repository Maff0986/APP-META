const express = require('express');
const router = express.Router();

const {
  publishNow,
  schedule,
  queue,
  overview,
  due,
  historial,
  preview
} = require('./../controllers/schedulerController');

// /scheduler/publish-now/:id
router.post('/publish-now/:id', publishNow);

// /scheduler/schedule
router.post('/schedule', schedule);

// /scheduler/queue
router.get('/queue', queue);

// /scheduler/overview
router.get('/overview', overview);

// /scheduler/due
router.get('/due', due);

// /scheduler/historial
router.get('/historial', historial);

// /scheduler/preview
router.post('/preview', preview);

module.exports = router;
