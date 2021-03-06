/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import {testTokenization} from './testRunner';
import {htmlTokenTypes} from '../src/html';

const DELIM_START = htmlTokenTypes.DELIM_START + '.html';
const DELIM_END = htmlTokenTypes.DELIM_END + '.html';
const ATTRIB_NAME = 'attribute.name.html';
const DELIM_ASSIGN = 'delimiter.html';
const ATTRIB_VALUE = 'attribute.value.html';

function getTag(name:string): string {
	return htmlTokenTypes.getTag(name) + '.html';
}

const DELIM_COMMENT = 'comment.html';
const COMMENT = 'comment.content.html';
const DELIM_DOCTYPE = 'metatag.html';
const DOCTYPE = 'metatag.content.html';

testTokenization(['html', 'css'], [

	// Open Start Tag #1'
	[{
		line: '<abc',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') }
		]
	}],

	// Open Start Tag #2
	[{
		line: '<input',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('input') }
		]
	}],

	// Open Start Tag with Invalid Tag
	[{
		line: '< abc',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: '' }
		]
	}],

	// Open Start Tag #3
	[{
		line: '< abc>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: '' }
		]
	}],

	// Open Start Tag #4
		[{
		line: 'i <len;',
		tokens: [
			{ startIndex:0, type: '' },
			{ startIndex:2, type: DELIM_START },
			{ startIndex:3, type: getTag('len') },
			{ startIndex:6, type: '' }
		]
	}],

	// Open Start Tag #5
	[{
		line: '<',
		tokens: [
			{ startIndex:0, type: DELIM_START }
		]
	}],

	// Open End Tag
	[{
		line: '</a',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:2, type: getTag('a') }
		]
	}],

	// Complete Start Tag
	[{
		line: '<abc>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: DELIM_END }
		]
	}],

	// Complete Start Tag with Whitespace
	[{
		line: '<abc >',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:5, type: DELIM_END }
		]
	}],

	// bug 9809 - Complete Start Tag with Namespaceprefix
	[{
		line: '<foo:bar>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('foo-bar') },
			{ startIndex:8, type: DELIM_END }
		]
	}],

	// Complete End Tag
	[{
		line: '</abc>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:2, type: getTag('abc') },
			{ startIndex:5, type: DELIM_END }
		]
	}],

	// Complete End Tag with Whitespace
	[{
		line: '</abc  >',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:2, type: getTag('abc') },
			{ startIndex:5, type: '' },
			{ startIndex:7, type: DELIM_END }
		]
	}],

	// Empty Tag
	[{
		line: '<abc />',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:5, type: DELIM_END }
		]
	}],

	// Embedded Content #1
	[{
		line: '<script type="text/javascript">var i= 10;</script>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('script') },
			{ startIndex:7, type: '' },
			{ startIndex:8, type: ATTRIB_NAME },
			{ startIndex:12, type: DELIM_ASSIGN },
			{ startIndex:13, type: ATTRIB_VALUE },
			{ startIndex:30, type: DELIM_END },
			{ startIndex:31, type: '' },
			{ startIndex:41, type: DELIM_START },
			{ startIndex:43, type: getTag('script') },
			{ startIndex:49, type: DELIM_END }
		]
	}],

	// Embedded Content #2
	[{
		line: '<script type="text/javascript">',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('script') },
			{ startIndex:7, type: '' },
			{ startIndex:8, type: ATTRIB_NAME },
			{ startIndex:12, type: DELIM_ASSIGN },
			{ startIndex:13, type: ATTRIB_VALUE },
			{ startIndex:30, type: DELIM_END }
		]
	}, {
		line: 'var i= 10;',
		tokens: [
			{ startIndex:0, type: '' },
		]
	}, {
		line: '</script>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:2, type: getTag('script') },
			{ startIndex:8, type: DELIM_END }
		]
	}],

	// Embedded Content #3
	[{
		line: '<script type="text/javascript">var i= 10;',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('script') },
			{ startIndex:7, type: '' },
			{ startIndex:8, type: ATTRIB_NAME },
			{ startIndex:12, type: DELIM_ASSIGN },
			{ startIndex:13, type: ATTRIB_VALUE },
			{ startIndex:30, type: DELIM_END },
			{ startIndex:31, type: '' },
		]
	}, {
		line: '</script>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:2, type: getTag('script') },
			{ startIndex:8, type: DELIM_END }
		]
	}],

	// Embedded Content #4
	[{
		line: '<script type="text/javascript">',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('script') },
			{ startIndex:7, type: '' },
			{ startIndex:8, type: ATTRIB_NAME },
			{ startIndex:12, type: DELIM_ASSIGN },
			{ startIndex:13, type: ATTRIB_VALUE },
			{ startIndex:30, type: DELIM_END }
		]
	}, {
		line: 'var i= 10;</script>',
		tokens: [
			{ startIndex:0, type: '' },
			{ startIndex:10, type: DELIM_START },
			{ startIndex:12, type: getTag('script') },
			{ startIndex:18, type: DELIM_END }
		]
	}],

	// Embedded Content #5
	[{
		line: '<script type="text/plain">a',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('script') },
			{ startIndex:7, type: '' },
			{ startIndex:8, type: ATTRIB_NAME },
			{ startIndex:12, type: DELIM_ASSIGN },
			{ startIndex:13, type: ATTRIB_VALUE },
			{ startIndex:25, type: DELIM_END },
			{ startIndex:26, type: '' },
		]
	},{
		line: '<a</script>',
		tokens: [
			{ startIndex:0, type: '' },
			{ startIndex:2, type: DELIM_START },
			{ startIndex:4, type: getTag('script') },
			{ startIndex:10, type: DELIM_END }
		]
	}],

	// Embedded Content #6
	[{
		line: '<script>a</script><script>b</script>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('script') },
			{ startIndex:7, type: DELIM_END },
			{ startIndex:8, type: '' },
			{ startIndex:9, type: DELIM_START },
			{ startIndex:11, type: getTag('script') },
			{ startIndex:17, type: DELIM_END },
			// { startIndex:18, type: DELIM_START },
			{ startIndex:19, type: getTag('script') },
			{ startIndex:25, type: DELIM_END },
			{ startIndex:26, type: '' },
			{ startIndex:27, type: DELIM_START },
			{ startIndex:29, type: getTag('script') },
			{ startIndex:35, type: DELIM_END }
		]
	}],

	// Embedded Content #7
	[{
		line: '<script type="text/javascript"></script>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('script') },
			{ startIndex:7, type: '' },
			{ startIndex:8, type: ATTRIB_NAME },
			{ startIndex:12, type: DELIM_ASSIGN },
			{ startIndex:13, type: ATTRIB_VALUE },
			{ startIndex:30, type: DELIM_END },
			// { startIndex:31, type: DELIM_START },
			{ startIndex:33, type: getTag('script') },
			{ startIndex:39, type: DELIM_END }
		]
	}],

	// Embedded Content #8
	[{
		line: '<script>var i= 10;</script>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('script') },
			{ startIndex:7, type: DELIM_END },
			{ startIndex:8, type: '' },
			{ startIndex:18, type: DELIM_START },
			{ startIndex:20, type: getTag('script') },
			{ startIndex:26, type: DELIM_END }
		]
	}],

	// Embedded Content #9
	[{
		line: '<script type="text/javascript" src="main.js"></script>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('script') },
			{ startIndex:7, type: '' },
			{ startIndex:8, type: ATTRIB_NAME },
			{ startIndex:12, type: DELIM_ASSIGN },
			{ startIndex:13, type: ATTRIB_VALUE },
			{ startIndex:30, type: '' },
			{ startIndex:31, type: ATTRIB_NAME },
			{ startIndex:34, type: DELIM_ASSIGN },
			{ startIndex:35, type: ATTRIB_VALUE },
			{ startIndex:44, type: DELIM_END },
			// { startIndex:45, type: DELIM_START },
			{ startIndex:47, type: getTag('script') },
			{ startIndex:53, type: DELIM_END }
		]
	}],

	// Tag with Attribute
	[{
		line: '<abc foo="bar">',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:5, type: ATTRIB_NAME },
			{ startIndex:8, type: DELIM_ASSIGN },
			{ startIndex:9, type: ATTRIB_VALUE },
			{ startIndex:14, type: DELIM_END }
		]
	}],

	// Tag with Empty Attribute Value
	[{
		line: '<abc foo=\'bar\'>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:5, type: ATTRIB_NAME },
			{ startIndex:8, type: DELIM_ASSIGN },
			{ startIndex:9, type: ATTRIB_VALUE },
			{ startIndex:14, type: DELIM_END }
		]
	}],

	// Tag with empty attributes
	[{
		line: '<abc foo="">',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:5, type: ATTRIB_NAME },
			{ startIndex:8, type: DELIM_ASSIGN },
			{ startIndex:9, type: ATTRIB_VALUE },
			{ startIndex:11, type: DELIM_END }
		]
	}],

	// Tag with Attributes
	[{
		line: '<abc foo="bar" bar=\'foo\'>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:5, type: ATTRIB_NAME },
			{ startIndex:8, type: DELIM_ASSIGN },
			{ startIndex:9, type: ATTRIB_VALUE },
			{ startIndex:14, type: '' },
			{ startIndex:15, type: ATTRIB_NAME },
			{ startIndex:18, type: DELIM_ASSIGN },
			{ startIndex:19, type: ATTRIB_VALUE },
			{ startIndex:24, type: DELIM_END }
		]
	}],

	// Tag with Attributes, no quotes
	[{
		line: '<abc foo=bar bar=help-me>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:5, type: ATTRIB_NAME },
			{ startIndex:8, type: DELIM_ASSIGN },
			{ startIndex:9, type: ATTRIB_NAME }, // slightly incorrect
			{ startIndex:12, type: '' },
			{ startIndex:13, type: ATTRIB_NAME },
			{ startIndex:16, type: DELIM_ASSIGN },
			{ startIndex:17, type: ATTRIB_NAME }, // slightly incorrect
			{ startIndex:24, type: DELIM_END }
		]
	}],

	// Tag with Attribute And Whitespace
	[{
		line: '<abc foo=  "bar">',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:5, type: ATTRIB_NAME },
			{ startIndex:8, type: DELIM_ASSIGN },
			{ startIndex:9, type: '' },
			{ startIndex:11, type: ATTRIB_VALUE },
			{ startIndex:16, type: DELIM_END }
		]
	}],

	// Tag with Attribute And Whitespace #2
	[{
		line: '<abc foo = "bar">',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:5, type: ATTRIB_NAME },
			{ startIndex:8, type: '' },
			{ startIndex:9, type: DELIM_ASSIGN },
			{ startIndex:10, type: '' },
			{ startIndex:11, type: ATTRIB_VALUE },
			{ startIndex:16, type: DELIM_END }
		]
	}],

	// Tag with Name-Only-Attribute #1
	[{
		line: '<abc foo>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:5, type: ATTRIB_NAME },
			{ startIndex:8, type: DELIM_END }
		]
	}],

	// Tag with Name-Only-Attribute #2
	[{
		line: '<abc foo bar>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:5, type: ATTRIB_NAME },
			{ startIndex:8, type: '' },
			{ startIndex:9, type: ATTRIB_NAME },
			{ startIndex:12, type: DELIM_END }
		]
	}],

	// Tag with Interesting Attribute Name
	[{
		line: '<abc foo!@#="bar">',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:5, type: ATTRIB_NAME },
			{ startIndex:8, type: '' },
			{ startIndex:11, type: DELIM_ASSIGN },
			{ startIndex:12, type: ATTRIB_VALUE },
			{ startIndex:17, type: DELIM_END }
		]
	}],

	// Tag with Angular Attribute Name
	[{
		line: '<abc #myinput (click)="bar" [value]="someProperty" *ngIf="someCondition">',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:6, type: ATTRIB_NAME },
			{ startIndex:13, type: '' },
			{ startIndex:15, type: ATTRIB_NAME },
			{ startIndex:20, type: '' },
			{ startIndex:21, type: DELIM_ASSIGN },
			{ startIndex:22, type: ATTRIB_VALUE },
			{ startIndex:27, type: '' },
			{ startIndex:29, type: ATTRIB_NAME },
			{ startIndex:34, type: '' },
			{ startIndex:35, type: DELIM_ASSIGN },
			{ startIndex:36, type: ATTRIB_VALUE },
			{ startIndex:50, type: '' },
			{ startIndex:52, type: ATTRIB_NAME },
			{ startIndex:56, type: DELIM_ASSIGN },
			{ startIndex:57, type: ATTRIB_VALUE },
			{ startIndex:72, type: DELIM_END }
		]
	}],

	// Tag with Invalid Attribute Value
	[{
		line: '<abc foo=">',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('abc') },
			{ startIndex:4, type: '' },
			{ startIndex:5, type: ATTRIB_NAME },
			{ startIndex:8, type: DELIM_ASSIGN },
			{ startIndex:9, type: '' },
			{ startIndex:10, type: DELIM_END }
		]
	}],

	// Simple Comment 1
	[{
		line: '<!--a-->',
		tokens: [
			{ startIndex:0, type: DELIM_COMMENT },
			{ startIndex:4, type: COMMENT },
			{ startIndex:5, type: DELIM_COMMENT }
		]
	}],

	// Simple Comment 2
	[{
		line: '<!--a>foo bar</a -->',
		tokens: [
			{ startIndex:0, type: DELIM_COMMENT },
			{ startIndex:4, type: COMMENT },
			{ startIndex:17, type: DELIM_COMMENT }
		]
	}],

	// Multiline Comment
	[{
		line: '<!--a>',
		tokens: [
			{ startIndex:0, type: DELIM_COMMENT },
			{ startIndex:4, type: COMMENT }
		]
	},{
		line: 'foo ',
		tokens: [
			{ startIndex:0, type: COMMENT },
		]
	},{
		line: 'bar</a -->',
		tokens: [
			{ startIndex:0, type: COMMENT },
			{ startIndex:7, type: DELIM_COMMENT }
		]
	}],

	// Simple Doctype
	[{
		line: '<!DOCTYPE a>',
		tokens: [
			{ startIndex:0, type: DELIM_DOCTYPE },
			{ startIndex:9, type: DOCTYPE },
			{ startIndex:11, type: DELIM_DOCTYPE }
		]
	}],

	// Simple Doctype #2
	[{
		line: '<!doctype a>',
		tokens: [
			{ startIndex:0, type: DELIM_DOCTYPE },
			{ startIndex:9, type: DOCTYPE },
			{ startIndex:11, type: DELIM_DOCTYPE }
		]
	}],

	// Simple Doctype #4
	[{
		line: '<!DOCTYPE a',
		tokens: [
			{ startIndex:0, type: DELIM_DOCTYPE },
			{ startIndex:9, type: DOCTYPE },
		]
	}, {
		line: '"foo" \'bar\'>',
		tokens: [
			{ startIndex:0, type: DOCTYPE },
			{ startIndex:11, type: DELIM_DOCTYPE }
		]
	}],

	// PR #14
	[{
		line: '<asdf:bar>asd</asdf:bar>',
		tokens: [
			{ startIndex:0, type: DELIM_START },
			{ startIndex:1, type: getTag('asdf:bar') },
			{ startIndex:9, type: DELIM_END },
			{ startIndex:10, type: '' },
			{ startIndex:13, type: DELIM_START },
			{ startIndex:15, type: getTag('asdf:bar') },
			{ startIndex:23, type: DELIM_END }
		]
	}]
]);
