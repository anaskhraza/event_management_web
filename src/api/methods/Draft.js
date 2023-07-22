import Api from '../index';
import ApiConstants from '../ApiConstants';

export async function createDraft(data) {
    return await Api(
        `drafts/create`,
        data,
        'post',
        null
    );
}


export async function deleteDraft(draftId) {
    return await Api(
        `drafts/draft?draftId=${draftId}`,
        null,
        'delete',
        null
    );
}


export async function getDraftList() {
    return await Api(
        `drafts/`,
        null,
        'get',
        null
    );
}