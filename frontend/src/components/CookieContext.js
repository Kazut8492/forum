import { createContext, useState, useEffect } from "react";

const doesHttpOnlyCookieExist = (cookiename) => {
    var d = new Date();
    d.setTime(d.getTime() + (1000));
    var expires = "expires=" + d.toUTCString();
  
    document.cookie = cookiename + "=new_value;path=/;" + expires;
    return document.cookie.indexOf(cookiename + '=') === -1;
}

const CookieContext = createContext();

const CookieProvider = (props) => {
    const [cookieExist, setCookieExist] = useState(doesHttpOnlyCookieExist("cookie"))

    const value = {cookieExist, setCookieExist}

    return (
        <CookieContext.Provider value={value}>
            {props.children}
        </CookieContext.Provider>
    )
}

export {CookieContext, CookieProvider, doesHttpOnlyCookieExist};