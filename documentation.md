## Constants

<dl>
<dt><a href="#request">request</a></dt>
<dd><p>Module dependencies.</p>
</dd>
<dt><a href="#eventsIridium">eventsIridium</a> : <code>Array.&lt;string&gt;</code></dt>
<dd><p>List of event types for Iridium flares.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getTable">getTable(config)</a></dt>
<dd><p>Retrieves table data from the specified URL and saves it to the file system.</p>
</dd>
</dl>

<a name="request"></a>

## request
Module dependencies.

**Kind**: global constant  
<a name="eventsIridium"></a>

## eventsIridium : <code>Array.&lt;string&gt;</code>
List of event types for Iridium flares.

**Kind**: global constant  
<a name="getTable"></a>

## getTable(config)
Retrieves table data from the specified URL and saves it to the file system.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Configuration object. |
| config.database | <code>Array.&lt;Object&gt;</code> | Array to store table data. |
| config.counter | <code>number</code> | Counter for pagination. |
| config.opt | <code>string</code> | URL query parameters. |
| config.root | <code>string</code> | Root directory path. |

