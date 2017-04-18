 import { Meteor } from 'meteor/meteor';
 import { Random } from 'meteor/random';
 import { assert } from 'meteor/practicalmeteor:chai';



 import { documentsdb } from '../../../lib/database.js';

if (Meteor.isClient) {
    import './page1.js';
    console.log("hola");
    describe('page1', () => {
        describe('methods', () => {
        const userId = Random.id();
        const documentId = Random.id();
        const email = Random.id();
        });
    
        it('canCalculateHash', () => {
            // Find the internal implementation of the task method so we can
            // test it in isolation
            var sad = sadir();
    
            // Verify that the method does what we expected
            assert.equal(sad, "yay");
        });
        });
}
