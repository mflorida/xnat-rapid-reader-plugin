<%-- initialize JSP vars --%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>

<sec:authorize var="loggedIn" access="isAuthenticated()"/>

<c:if test="${loggedIn && empty requestScope.hasInit}">

    <c:set var="username" value="${pageContext.request.userPrincipal.name}" scope="session"/>

    <c:set var="isAdmin" value="false" scope="session"/>
    <c:set var="isGuest" value="false" scope="session"/>

    <sec:authorize access="hasAnyRole('ADMIN')">
        <c:set var="isAdmin" value="true" scope="session"/>
    </sec:authorize>

    <sec:authorize access="hasAnyRole('ANONYMOUS')">
        <c:set var="isGuest" value="true" scope="session"/>
    </sec:authorize>

    <%-- set 'siteRoot' to the root of your web app --%>
    <c:set var="siteRoot" value="${pageContext.request.contextPath}" scope="session"/>

    <%-- add a leading slash if siteRoot is not empty and doesn't already start with a slash --%>
    <c:if test="${siteRoot != '' && !fn:startsWith(siteRoot,'/')}">
        <c:set var="siteRoot" value="/${pageContext.request.contextPath}" scope="session"/>
    </c:if>

    <%-- get session expiration time --%>
    <c:set var="sessionExpiration" value="${cookie.SESSION_EXPIRATION_TIME.value}" scope="session"/>

    <c:set var="csrfToken" value="0" scope="session"/>

    <c:if test="${loggedIn == true}">
        <c:set var="csrfToken" value="${sessionScope.XNAT_CSRF}" scope="session"/>
        <%--     0b181f61-242f-490d-a32e-82b786e8fabc     --%>
        <c:set var="tokenParts" value="${csrfToken.split('-')}"/>
        <c:set var="sessionValue" scope="session" value="/${tokenParts[1]}/${tokenParts[3]}/${tokenParts[4]}/${tokenParts[0]}/${tokenParts[2]}/"/>
    </c:if>

    <c:set var="hasInit" value="true" scope="request"/>

</c:if>
