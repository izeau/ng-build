(function() {
'use strict';

// <%= name %> (<%= dirname %>)

angular

.module(<%= $.json(name) %>, <%= $.json(requires) %>)
<% if (templates.length) {
%>
.run(function($templateCache) {
<%     templates.forEach(function(template) {
%>    $templateCache.put(<%= $.json(template.name) %>, <%= $.json($.trim(template.contents)) %>);
<%     })
%>})
<% }
%><% blocks.forEach(function(block) {
%>
.<%= block.type %>(<%= $.trim(block.contents) %>)
<% })
%><% providers.forEach(function(provider) {
%>
.<%= provider.type %>(<%= $.json(provider.name) %>, <%= $.trim(provider.contents) %>)
<% })%>;
})();
