import { Mongo } from 'meteor/mongo';

export const documentsdb = new Mongo.Collection('documentsdb');
export const institutions = new Mongo.Collection('institutions');
export const toSign = new Mongo.Collection('toSign');
export const signed = new Mongo.Collection('signed')
