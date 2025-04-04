import { SIPMessage, SIPRequest, SIPResponse } from './types';
import { stringifyUri } from './uri';
import { stringifyHeader } from './headers';

export function stringify(message: SIPMessage): string {
    const startLine = makeStartLine(message) + '\r\n';
    const headerLines = message.headers.map(header => stringifyHeader(header));
    let messageString = startLine + headerLines.join('\r\n') + '\r\n\r\n';
    if (message.content?.length > 0)
        messageString += message.content;

    return messageString;
}

function makeStartLine(message: SIPMessage) {
    if ('method' in message) {
        return makeRequestStartLine(message);
    } else {
        return makeResponseStartLine(message);
    }
}

function makeRequestStartLine(message: SIPRequest): string {
    return `${message.method} ${stringifyUri(message.requestUri, true)} SIP/${message.version}`;
}

function makeResponseStartLine(message: SIPResponse): string {
    return `SIP/${message.version} ${message.statusCode} ${message.reason}`;
}
