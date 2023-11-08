'use strict';

import * as db from './index';
import { ObjectId } from 'mongodb';
import toObjectId from '../lib/misc/toobjectid';

export const CredentialPlatforms = ['OPENAI', 'AZURE'] as const; // TODO: more
export type CredentialPlatform = typeof CredentialPlatforms[number]; // 'OPENAI' | 'AZURE'

export type Credential = {
	_id?: ObjectId;
	orgId: ObjectId;
	teamId: ObjectId;
	platform: CredentialPlatform;
	credentials: {
		key?: string;
		//TODO: more
	};
    name: string;
    createdDate: Date;
}

export function CredentialCollection() {
	return db.db().collection('credentials');
}

export function getCredentialById(teamId: db.IdOrStr, credentialId: db.IdOrStr): Promise<Credential> {
	return CredentialCollection().findOne({
		_id: toObjectId(credentialId),
		teamId: toObjectId(teamId),
	}, {
		projection: {
			credentials: 0,
		}
	});
}

export function getCredentialsByTeam(teamId: db.IdOrStr): Promise<Credential> {
	return CredentialCollection().find({
		teamId: toObjectId(teamId),
	}, {
		projection: {
			credentials: 0,
		}
	}).toArray();
}

export async function addCredential(credential: Credential): Promise<db.InsertResult> {
	return CredentialCollection().insertOne(credential);
}

export function deleteCredentialById(teamId: db.IdOrStr, credentialId: db.IdOrStr): Promise<any> {
	return CredentialCollection().deleteOne({
		_id: toObjectId(credentialId),
		teamId: toObjectId(teamId),
	});
}