import { readBufferFromPtr, writeBufferToPr } from "./buffer";
import { Protobuf } from "@asterai/as-proto/assembly";
import { HostLogRequest } from "./generated/HostLogRequest";
import { HostVectorEmbeddingSimilarityScore } from "./generated/HostVectorEmbeddingSimilarityScore";
import { HostVectorEmbeddingSearchRequest } from "./generated/HostVectorEmbeddingSearchRequest";
import { HostVectorEmbeddingSearchResponse } from "./generated/HostVectorEmbeddingSearchResponse";
import { HostHttpRequest } from "./generated/HostHttpRequest";
import { HostHttpResponse } from "./generated/HostHttpResponse";
import { HostKvGetUserStringRequest } from "./generated/HostKvGetUserStringRequest";
import { HostKvGetUserStringResponse } from "./generated/HostKvGetUserStringResponse";
import { HostKvSetUserStringRequest } from "./generated/HostKvSetUserStringRequest";
import { HostVectorEmbeddingStoreRequest } from "./generated/HostVectorEmbeddingStoreRequest";

declare namespace host {
  export function log(request: u32): void;
  export function http_request(request: u32): u32;
  export function vector_embedding_store(request: u32): void;
  export function vector_embedding_search(request: u32): u32;
  export function kv_get_user_string(request: u32): u32;
  export function kv_set_user_string(request: u32): void;
}

export class Log {
  public static trace(content: string): void {
    Log.level(content, "trace");
  }

  public static debug(content: string): void {
    Log.level(content, "debug");
  }

  public static info(content: string): void {
    Log.level(content, "info");
  }

  public static warn(content: string): void {
    Log.level(content, "warn");
  }

  public static error(content: string): void {
    Log.level(content, "error");
  }

  static level(content: string, level: string): void {
    const request = new HostLogRequest(content, level);
    const bytes = Protobuf.encode<HostLogRequest>(
      request,
      HostLogRequest.encode,
    );
    host.log(writeBufferToPr(bytes));
  }
}

export class HttpRequest {
  // HTTP request anatomy:
  // GET / HTTP/1.1
  // Host: example.com
  // Connection: close
  //
  // BODY_CONTENT

  private readonly content: string;

  public constructor(content: string) {
    this.content = content;
  }

  public send(): HostHttpResponse {
    const request = new HostHttpRequest(this.content);
    const requestBytes = Protobuf.encode<HostHttpRequest>(
      request,
      HostHttpRequest.encode,
    );
    const responsePtr = host.http_request(writeBufferToPr(requestBytes));
    return Protobuf.decode<HostHttpResponse>(
      readBufferFromPtr(responsePtr),
      HostHttpResponse.decode,
    );
  }
}

export class HttpRequestBuilder {
  private _headers: Map<string, string> = new Map();
  private _queries: Map<string, string> = new Map();
  private _method: string = "GET";
  private _path: string = "/";
  private _body: string = "";
  private _version: string = "HTTP/1.1";

  public constructor(host: string) {
    this._headers.set("host", host);
    this._headers.set("connection", "close");
  }

  public header(key: string, value: string): HttpRequestBuilder {
    this._headers.set(key.toLowerCase(), value);
    return this;
  }

  public query(key: string, value: string): HttpRequestBuilder {
    this._queries.set(key, encodeURIComponent(value));
    return this;
  }

  public method(value: string): HttpRequestBuilder {
    this._method = value;
    return this;
  }

  public path(value: string): HttpRequestBuilder {
    this._path = value;
    return this;
  }

  public body(value: string): HttpRequestBuilder {
    this._body = value;
    return this;
  }

  public version(value: string): HttpRequestBuilder {
    this._version = value;
    return this;
  }

  public build(): HttpRequest {
    const queryString = this.renderQueryString();
    this.setDefaultContentLengthHeader();
    const headers = this.renderHeaders();
    const method = this._method;
    const path = this._path;
    const version = this._version;
    const body = this._body;
    const content = `${method} ${path}${queryString} ${version}\r\n${headers}\r\n${body}`;
    return new HttpRequest(content);
  }

  private setDefaultContentLengthHeader(): void {
    if (this._headers.has("content-length")) {
      return;
    }
    this._headers.set("content-length", this._body.length.toString());
  }

  public send(): HostHttpResponse {
    return this.build().send();
  }

  private renderHeaders(): string {
    let headers = "";
    const keys = this._headers.keys();
    const values = this._headers.values();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = values[i];
      headers += `${key}: ${value}\r\n`;
    }
    return headers;
  }

  private renderQueryString(): string {
    let queryString = "";
    const keys = this._queries.keys();
    if (keys.length > 0) {
      queryString += "?";
    }
    const values = this._queries.values();
    for (let i = 0; i < keys.length; i++) {
      if (i > 0) {
        queryString += "&";
      }
      const key = keys[i];
      const value = values[i];
      queryString += `${key}=${value}`;
    }
    return queryString;
  }
}

export function encodeUriComponent(input: string): string {
  let result: string = "";

  for (let i = 0; i < input.length; i++) {
    const c = input.charAt(i);
    if (isSafe(c)) {
      result += c;
    } else {
      result += "%" + c.charCodeAt(0).toString(16).toUpperCase();
    }
  }

  return result;
}

function isSafe(c: string): boolean {
  return (
    (c >= "a" && c <= "z") ||
    (c >= "A" && c <= "Z") ||
    (c >= "0" && c <= "9") ||
    c == "-" ||
    c == "_" ||
    c == "." ||
    c == "*"
  );
}

export class VectorEmbedding {
  public static semanticStore(request: HostVectorEmbeddingStoreRequest): void {
    const requestBytes = Protobuf.encode<HostVectorEmbeddingStoreRequest>(
      request,
      HostVectorEmbeddingStoreRequest.encode,
    );
    host.vector_embedding_store(writeBufferToPr(requestBytes));
    return;
  }

  public static semanticSearch(
    request: HostVectorEmbeddingSearchRequest,
  ): HostVectorEmbeddingSimilarityScore[] {
    const requestBytes = Protobuf.encode<HostVectorEmbeddingSearchRequest>(
      request,
      HostVectorEmbeddingSearchRequest.encode,
    );
    const responsePtr = host.vector_embedding_search(
      writeBufferToPr(requestBytes),
    );
    const response = Protobuf.decode<HostVectorEmbeddingSearchResponse>(
      readBufferFromPtr(responsePtr),
      HostVectorEmbeddingSearchResponse.decode,
    );
    return response.results;
  }
}

export class UserKvStorage {
  private readonly userId: string;

  public constructor(userId: string) {
    this.userId = userId;
  }

  public getString(key: string): string | null {
    const request = new HostKvGetUserStringRequest(this.userId, key);
    const requestBytes = Protobuf.encode<HostKvGetUserStringRequest>(
      request,
      HostKvGetUserStringRequest.encode,
    );
    const responsePtr = host.kv_get_user_string(writeBufferToPr(requestBytes));
    const response = Protobuf.decode<HostKvGetUserStringResponse>(
      readBufferFromPtr(responsePtr),
      HostKvGetUserStringResponse.decode,
    );
    return response.value;
  }

  public setString(key: string, value: string | null): void {
    const request = new HostKvSetUserStringRequest(this.userId, key);
    const requestBytes = Protobuf.encode<HostKvSetUserStringRequest>(
      request,
      HostKvSetUserStringRequest.encode,
    );
    host.kv_set_user_string(writeBufferToPr(requestBytes));
  }
}
