import 'dotenv/config';
import e from 'express';
import express from 'express';
//import asyncHandler from 'express-async-handler';
import * as exercise from './exercise_model.mjs';
import validator from 'validator';

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

function isDateValid(date) {
    // Test using a regular expression. 
    // To learn about regular expressions see Chapter 6 of the text book
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

function validateEntries(name, reps, weight, unit, date){
    if(name === ""){
        return false
    }else if(reps < "1"){
        return false
    }else if(weight < "1"){
        return false
    }else if(unit !== "lbs" && unit !== "kgs"){
        return false
    }else if(!isDateValid(date)){
        return false
    }else{
        return true
    }}

//name, reps, weight, units, date
app.post('/exercises', 
    
    (req, res) => {
        if (!validateEntries(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)){
            res.status(400).json({ Error: 'Invalid request' });
        }else{
            exercise.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)

        
        .then(exercise => {
        res.status(201).json(exercise)
            })
    .catch(error => {
        console.error(error);
        res.status(404).json({ Error: 'Invalid request' });
        });
}});

app.get('/exercises/:_id', (req, res) => { 
    //let filter = {_id: req.params._id};

    console.log(req.params._id)
    exercise.findExerciseById(req.params._id)
        .then(exercise => {
            if (exercise !== null) {
                res.status(200).json(exercise);
            } else {
                res.status(404).json({ Error: 'Not found' });
            }         
         })
        .catch(error => {
            res.status(404).json({ Error: 'Request failed' });
        });
    });

app.get('/exercises', (req, res) => {
    let filter = {};
        
    exercise.findExercises(filter)//, "", 0)
        .then(exercise => {
            if (exercise !== null) {
                    res.status(201).json(exercise);
            } else {
                    res.status(404).json({ Error: 'Not found' });
            }         
        })
        .catch(error => {
            res.status(400).json({ Error: 'Request failed' });
        });
});

app.put('/exercises/:_id', (req, res) => {
    let update = {};
    /*if (req.body.name !== undefined){
        update.name = req.body.name
    }
    if (req.body.reps !== undefined){
        update.reps = req.body.reps
    }
    if (req.body.weight !== undefined){
        update.weight = req.body.weight
    }
    if (req.body.unit !== undefined){
        update.unit = req.body.unit
    }
    if (req.body.date !== undefined){
        update.date = req.body.date
    }*/
    if (!validateEntries(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)){
        res.status(400).json({ Error: 'Invalid request' });
    }else{
        update.name = req.body.name
        update.reps = req.body.reps
        update.weight = req.body.weight
        update.unit = req.body.unit
        update.date = req.body.date
    }
    
    exercise.updateExercise({_id: req.params._id}, update)
    .then(numUpdated => {
        if (numUpdated === 1) {
                res.status(200).json({_id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date});
            } else {
                res.status(404).json({ Error: 'Resource not found' });
        }         
    })
    .catch(error => {
        console.error(error)
        res.status(400).json({ Error: 'Request failed' });
    });
});

app.delete('/exercises/:_id', (req, res) => {
    exercise.deleteExercise(req.params._id)
    .then(deletedCount => {
        if (deletedCount === 1) {
            res.status(204).send();
        } else {
            res.status(404).json({ Error: 'Not found' });
        }         
        })
        .catch(error => {
            console.error(error)
            res.status(400).json({ Error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});