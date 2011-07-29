
package net.sf.ooweb.util;

/** Shared constants.
 */
public interface Codes {
    /** Continue */
    static final int CONTINUE = 100;
    /** Switching Protocols */
    static final int SWITCHING_PROTOCOLS = 101;
    /** OK */
    static final int OK = 200;
    /** Created */
    static final int CREATED = 201;
    /** Accepted */
    static final int ACCEPTED = 202;
    /** Non-Authoritative Information */
    static final int NON_AUTHORITATIVE_INFORMATION = 203;
    /** No Content */
    static final int NO_CONTENT = 204;
    /** Reset Content */
    static final int RESET_CONTENT = 205;
    /** Partial Content */
    static final int PARTIAL_CONTENT = 206;
    /** Multiple Choices */
    static final int MULTIPLE_CHOICES = 300;
    /** Moved Permanently */
    static final int MOVED_PERMANENTLY = 301;
    /** Found */
    static final int FOUND = 302;
    /** See Other */
    static final int SEE_OTHER = 303;
    /** Not Modified */
    static final int NOT_MODIFIED = 304;
    /** Use Proxy */
    static final int USE_PROXY = 305;
    /** Temporary Redirect */
    static final int TEMPORARY_REDIRECT = 307;
    /** Bad Request */
    static final int BAD_REQUEST = 400;
    /** Unauthorized */
    static final int UNAUTHORIZED = 401;
    /** Payment Required */
    static final int PAYMENT_REQUIRED = 402;
    /** Forbidden */
    static final int FORBIDDEN = 403;
    /** Not Found */
    static final int NOT_FOUND = 404;
    /** Method Not Allowed */
    static final int METHOD_NOT_ALLOWED = 405;
    /** Not Acceptable */
    static final int NOT_ACCEPTABLE = 406;
    /** Proxy Authentication Required */
    static final int PROXY_AUTHENTICATION_REQUIRED = 407;
    /** Request Time-out */
    static final int REQUEST_TIME_OUT = 408;
    /** Conflict */
    static final int CONFLICT = 409;
    /** Gone */
    static final int GONE = 410;
    /** Length Required */
    static final int LENGTH_REQUIRED = 411;
    /** Precondition Failed */
    static final int PRECONDITION_FAILED = 412;
    /** Request Entity Too Large */
    static final int REQUEST_ENTITY_TOO_LARGE = 413;
    /** Request-URI Too Large */
    static final int REQUEST_URI_TOO_LARGE = 414;
    /** Unsupported Media Type */
    static final int UNSUPPORTED_MEDIA_TYPE = 415;
    /** Requested range not satisfiable */
    static final int REQUESTED_RANGE_NOT_SATISFIABLE = 416;
    /** Expectation Failed */
    static final int EXPECTATION_FAILED = 417;
    /** Internal PygmyServer Error */
    static final int INTERNAL_SERVER_ERROR = 500;
    /** Not Implemented */
    static final int NOT_IMPLEMENTED = 501;
    /** Bad Gateway */
    static final int BAD_GATEWAY = 502;
    /** Service Unavailable */
    static final int SERVICE_UNAVAILABLE = 503;
    /** Gateway Time-out */
    static final int GATEWAY_TIME_OUT = 504;
    /** HTTP Version not supported */
    static final int HTTP_VERSION_NOT_SUPPORTED = 505;

    /* General headers */
    /** Cache-Control */
    static final String CACHE_CONTROL = "Cache-Control";
    /** Connection */
    static final String CONNECTION = "Connection";
    /** Date */
    static final String DATE = "Date";
    /** Pragma */
    static final String PRAGMA = "Pragma";
    /** Trailer */
    static final String TRAILER = "Trailer";
    /** Transfer-Encoding */
    static final String TRANSFER_ENCODING = "Transfer-Encoding";
    /** Upgrade */
    static final String UPGRADE = "Upgrade";
    /** Via */
    static final String VIA = "Via";
    /** Warning */
    static final String WARNING = "Warning";

    /* Request headers */
    /** Accept */
    static final String ACCEPT = "Accept";
    /** Accept-Charset */
    static final String ACCEPT_CHARSET = "Accept-Charset";
    /** Accept-Encoding */
    static final String ACCEPT_ENCODING = "Accept-Encoding";
    /** Accept-Language */
    static final String ACCEPT_LANGUAGE = "Accept-Language";
    /** Authorization */
    static final String AUTHORIZATION = "Authorization";
    /** Expect */
    static final String EXPECT = "Expect";
    /** From */
    static final String FROM = "From";
    /** Host */
    static final String HOST = "Host";
    /** If-Match */
    static final String IF_MATCH = "If-Match";
    /** If-Modified-Since */
    static final String IF_MODIFIED_SINCE = "If-Modified-Since";
    /** If-None-Match */
    static final String IF_NONE_MATCH = "If-None-Match";
    /** If-Range */
    static final String IF_RANGE = "If-Range";
    /** If-Unmodified-Since */
    static final String IF_UNMODIFIED_SINCE = "If-Unmodified-Since";
    /** Max-Forwards */
    static final String MAX_FORWARDS = "Max-Forwards";
    /** Proxy-Authorization */
    static final String PROXY_AUTHORIZATION = "Proxy-Authorization";
    /** Range */
    static final String RANGE = "Range";
    /** Referer */
    static final String REFERER = "Referer";
    /** TE */
    static final String TE = "TE";
    /** User-Agent */
    static final String USER_AGENT = "User-Agent";

    /* Response headers */
    /** Accept-Ranges */
    static final String ACCEPT_RANGES = "Accept-Ranges";
    /** Age */
    static final String AGE = "Age";
    /** ETag */
    static final String ETAG = "ETag";
    /** Location */
    static final String LOCATION = "Location";
    /** Proxy-Authenticate */
    static final String PROXY_AUTHENTICATE = "Proxy-Authenticate";
    /** Retry-After */
    static final String RETRY_AFTER = "Retry-After";
    /** PygmyServer */
    static final String SERVER = "PygmyServer";
    /** Vary */
    static final String VARY = "Vary";
    /** WWW-Authenticate */
    static final String WWW_AUTHENTICATE = "WWW-Authenticate";
    /** Set-Cookie **/
    static final String SET_COOKIE = "Set-Cookie";

    static final String COOKIE = "Cookie";

    /* Entity headers */
    /** Allow */
    static final String ALLOW = "Allow";
    /** Content-Encoding */
    static final String CONTENT_ENCODING = "Content-Encoding";
    /** Content-Language */
    static final String CONTENT_LANGUAGE = "Content-Language";
    /** Content-Length */
    static final String CONTENT_LENGTH = "Content-Length";
    /** Content-Location */
    static final String CONTENT_LOCATION = "Content-Location";
    /** Content-MD5 */
    static final String CONTENT_MD5 = "Content-MD5";
    /** Content-Range */
    static final String CONTENT_RANGE = "Content-Range";
    /** Content-Type */
    static final String CONTENT_TYPE = "Content-Type";
    /** Expires */
    static final String EXPIRES = "Expires";
    /** Last-Modified */
    static final String LAST_MODIFIED = "Last-Modified";

    static final String FORMDATA_URLENCODED = "application/x-www-form-urlencoded";

    static final String FORMDATA_MULTIPART = "multipart/form-data";

    /* Tokens */
    /** Connection: close */
    static final String CLOSE = "close";
    /** HTTP/1.0 keep alive */
    static final String KEEP_ALIVE = "Keep-Alive";

    /* Types */
    /** text/html */
    static final String TEXT_HTML = "text/html";
    /** text/plain */
    static final String TEXT_PLAIN = "text/plain";
}
