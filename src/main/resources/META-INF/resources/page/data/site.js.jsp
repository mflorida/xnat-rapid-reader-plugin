<%@ page contentType="application/javascript" pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    <%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

    <%@ include file="init.jsp" %>

    <c:import url="/page/data/info.json.jsp" var="sessionInfo"/>

    (function(){

        function returnValue(val){ return val || '' }

        window.siteRoot = '${siteRoot}';
        window.username = '${username}';
        window.sessionInfo = returnValue(${fn:trim(sessionInfo)}) || []

    })();
