import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

const exerciseSchema = mongoose.Schema({
    name: {type: String, required: true},
    reps: {type: Number, required: true},
    weight: {type: Number, required: true},
    unit: {type: String, required: true},
    date: {type: String, required: true}
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

const createExercise = async (name, reps, weight, unit, date) => {
    const exercise = new Exercise({name: name, reps: reps, weight: weight, unit: unit, date:date});
    return exercise.save()
};

const findExercises = async (filter) => {
    const query = Exercise.find(filter);
    return query.exec();
}
const findExerciseById = async (_id) => {
    const query = Exercise.find({_id: _id});
    return query.exec();
}
const updateExercise = async (_id, update) => {
    const result = await Exercise.updateOne(_id, update);
    return result.modifiedCount;
}

const deleteExercise = async (_id, update) => {
    const result = await Exercise.deleteOne({_id: _id}, update);
    return result.deletedCount;
}

const deleteExercises = async (filter, update) => {
    const result = await Exercise.deleteMany(filter, update);
    return result.deletedCount;
}

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export {createExercise, findExercises, findExerciseById, updateExercise, deleteExercise, deleteExercises};