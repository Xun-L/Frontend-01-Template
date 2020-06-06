# 选择器语法
  简单选择器
    *
    div 
    svg|a
    .cls
    #id
    [attr=value]
    :hover
    ::before
   
  复合选择器

  复杂选择器


## 排版布局

### 盒模型

- box-sizing

	- content-box
	- border-box

### 正常流

- inline-format-context

	- vertical-align（只建议使用top，bottom,middle）

- block-format-context

	- display:inline-block,table-captions，flex,inline-flex
	- overflow不为visible
	- 根元素
	- position不为static和relative
	- float属性不为none

- float与clear
- margin折叠

	- 只发生在BFC内
	- 折叠方向

### flex布局
