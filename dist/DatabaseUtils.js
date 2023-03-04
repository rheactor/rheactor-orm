import{getDatetimeISO as e}from"./Utils";let t=/`/g;export const escapeId=e=>{if(""===e)throw Error("DatabaseUtils.escapeId(value) cannot be empty");if(e.includes("\x00"))throw Error("DatabaseUtils.escapeId(value) cannot includes \\u0000");return`\`${e.replace(t,"``")}\``};let a={"'":"\\'","\n":"\\n","\r":"\\r","\b":"\\b","	":"\\t","\\":"\\\\","\x00":"\\0","\x1a":"\\Z"},r=/['\n\r\b\t\\\u0000\u001A]/g,n=e=>e.replace(r,e=>a[e]);export const escape=t=>{switch(typeof t){case"boolean":return t?"TRUE":"FALSE";case"bigint":case"number":return`${t}`;case"object":if(null===t)return"NULL";if(t instanceof Date)return`'${e(t)}'`;return`_binary'${n(t.toString())}'`;case"undefined":return"NULL";default:return`'${n(t)}'`}};export const dropTable=(e,t)=>{e.query(`DROP TABLE IF EXISTS ${escapeId(t)}`)};export const showCreate=async(e,t)=>e.query(`SHOW CREATE TABLE ${escapeId(t)}`).then(([e])=>e["Create Table"]);export const createTable=async(e,t,a,r)=>{let n=r?.temporary===!0?"TEMPORARY TABLE":"TABLE",o=a.map(e=>e.asCreateSchema());a.forEach(e=>{!0===e.options.key&&o.push(`KEY \`${e.name}\` (\`${e.name}\`)`),!0===e.options.uniqueKey&&o.push(`UNIQUE KEY \`${e.name}\` (\`${e.name}\`)`),!0===e.options.primaryKey&&o.push(`PRIMARY KEY (\`${e.name}\`)`)});let s=[];r&&(void 0!==r.collate&&s.push(`COLLATE=${escapeId(r.collate)}`),void 0!==r.comment&&s.push(`COMMENT=${escape(r.comment)}`)),await e.query(`CREATE ${n} ${escapeId(t)}(${o.join(", ")})ENGINE=InnoDB ${s.join(" ")}`)};