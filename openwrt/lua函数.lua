-- table 模块是 的标准库之一，主要提供了一些基于表格的通用函数。 `table` 模块的 15 个函数的使用方法。

--[[ ### 1. table.concat(list [, sep [, i [, j]-]-])
 将一个表格中的元素以指定的分隔符连接成一个字符串，并返回这个字符串。
 参数说明：
 - `list`：被连接的表格，必选。
 - `sep`：可选的分隔符，用于在每个元素之间分隔，默认为空字符串。
 - `i`：可选的起始下标，默认为 1。
 - `j`：可选的结束下标，默认为表格长度。]]

-- 使用示例：
local t = {"foo", "bar", "baz"}
print(table.concat(t))        --> foobarbaz
print(table.concat(t, ", "))  --> foo, bar, baz
print(table.concat(t, "-", 2)) --> bar-baz

--[[### 2. table.insert(list [, pos,] value)
将一个元素插入到表格中，并返回它的索引。
参数说明：
- `list`：待插入元素的表格，必选。
- `pos`：可选的目标位置，表示插入前该位置后面的元素向后移动一个位置，默认为表格末尾。
- `value`：待插入的值，必选。

使用示例：--]]
local t = {"foo", "bar"}
table.insert(t, "baz")
print(table.concat(t, ", "))  --> foo, bar, baz

table.insert(t, 2, "qux")
print(table.concat(t, ", "))  --> foo, qux, bar, baz

--[[### 3. table.remove(list [, pos])
从一个表格中删除一个元素，并返回它的值。
参数说明：
- `list`：待删除元素的表格，必选。
- `pos`：可选的目标位置，表示要删除的元素的索引，默认为表格末尾。

使用示例：--]]
local t = {"foo", "bar", "baz"}
table.remove(t, 2)
print(table.concat(t, ", "))  --> foo, baz

table.remove(t)
print(table.concat(t, ", "))  --> foo

--[[### 4. table.sort(list [, comp])
对一个表格进行排序，默认升序排列。
参数说明：
- `list`：待排序的表格，必选。
- `comp`：可选的比较函数，用于指定排序规则，默认使用 `<` 运算符进行比较。
比较函数需要接受两个参数，分别是待比较的元素，可以是任意类型，且必须能够进行比较运算。如果第一个参数应该排在前面，则返回 true；否则返回 false。

使用示例：--]]
local t = {3, 1, 4, 1, 5, 9, 2, 6}
table.sort(t)
print(table.concat(t, ", "))           --> 1, 1, 2, 3, 4, 5, 6, 9

table.sort(t, function(a, b)
    return a > b
end)
print(table.concat(t, ", "))           --> 9, 6, 5, 4, 3, 2, 1, 1

--[[### 5. table.copy(list) 5.1版本之后
复制一个表格，返回新的表格。
参数说明：
- `list`：待复制的表格，必选。

使用示例：
-- local t1 = {1, 2, 3}
-- local t2 = table.copy(t1)
-- t1[1] = 0
-- print(table.unpack(t1))  --> 0 2 3
-- print(table.unpack(t2))  --> 1 2 3--]]

--[[### 6. table.move(a1, f, e, t [,a2]) 5.1版本之后
将一个表格中的一部分移动到另一个表格中，并返回这个表格。
参数说明：
- `a1`：原始表格，必选。
- `f`：起始位置，必选。
- `e`：结束位置，必选。
- `t`：目标位置，必选。
- `a2`：可选的目标表格，默认为 `a1`。

使用示例：
local t1 = {"foo", "bar", "baz", "qux"}
local t2 = {}
table.move(t1, 1, 3, 1, t2)
print(table.concat(t1, ", "))  --> qux
print(table.concat(t2, ", "))  --> foo, bar, baz

local t1 = {"foo", "bar", "baz", "qux"}
table.move(t1, 2, 4, 1)
print(table.concat(t1, ", "))  --> baz, qux, baz--]]

--[[### 7. table.pack(...) 5.1版本之后
将一组值打包成一个新的表格。
参数说明：可变数量的参数列表。
返回值：一个新的表格，其中包含所有参数，且额外包含一个 `n` 字段表示参数个数。

使用示例：
local t = table.pack("foo", "bar", "baz")
print(t[1], t[2], t[3])        --> foo bar baz
print(t.n)                     --> 3

t = table.pack(1, 2, nil, 4, 5)
print(t[1], t[2], t[3], t[4], t[5])  --> 1 2 nil 4 5
print(t.n)                          --> 5--]]

--[[ ### 8. table.unpack(list [, i [, j]-]) 5.1版本之后
 将一个表格展开成多个值。
 参数说明：
 - `list`：待展开的表格，必选。
 - `i`：可选的起始下标，默认为 1。
 - `j`：可选的结束下标，默认为表格长度。
 返回值：若指定了范围，则返回该范围内的所有元素；否则返回整个表格中的所有元素。

 使用示例：
 local t = {"foo", "bar", "baz"}
 print(table.unpack(t))             --> foo bar baz]]

--[[### 9. table.foreach(t, f)
对表格 `t` 中的每个元素调用函数 `f`，并返回结果。
函数 `f` 需要接受两个参数，分别是当前正在处理的元素的索引和值。如果 `f` 返回非空值，则会终止遍历并返回该值。
参数说明：
- `t`：待遍历的表格，必选。
- `f`：用于处理每个元素的函数，必选。

使用示例：--]]
local t = {"foo", "bar", "baz"}
table.foreach(t, function(i, v)
    print(i, v)
end)

--[[
1	foo
2	bar
3	baz
]]

local t = {x = 1, y = 2, z = 3}
table.foreach(t, function(k, v)
    print(k, v)
end)

--[[
x	1
y	2
z	3
]]

--[[### 10. table.foreachi(t, f)
对表格 `t` 中的每个整数索引处的元素调用函数 `f`，并返回结果。遇到非整数索引时停止遍历。
函数 `f` 需要接受两个参数，分别是当前正在处理的元素的索引和值。如果 `f` 返回非空值，则会终止遍历并返回该值。
参数说明：
- `t`：待遍历的表格，必选。
- `f`：用于处理每个元素的函数，必选。

使用示例：--]]
local t = {"foo", "bar", "baz"}
table.foreachi(t, function(i, v)
    print(i, v)
end)

--[[
1	foo
2	bar
3	baz
]]

local t = {x = 1, y = 2, z = 3}
table.foreachi(t, function(k, v)
    print(k, v)
end)

-- 无输出（因为没有整数索引）

--[[### 11. table.getn(list)
获取表格 `list` 的长度。
**注意：在 Lua 5.1 中使用，已在 Lua 5.2 中被移除。**
参数说明：
- `list`：待获取长度的表格，必选。

使用示例：--]]
local t = {1, 2, 3}
print(table.getn(t))  --> 3

--[[### 12. table.maxn(t)
获取表格 `t` 中最大的整数索引。
**注意：在 Lua 5.2 或以上版本中使用，已在 Lua 5.3 中被移除。**
参数说明：
- `t`：待获取最大整数索引的表格，必选。

使用示例：--]]
local t = {"foo", "bar", "baz"}
print(table.maxn(t))  --> 3

local t = {[1] = "foo", [10] = "bar", [100] = "baz"}
print(table.maxn(t))  --> 100

--[[ ### 13. table.concat(table, [, sep [, i [, j]-]-])
 将一个表格中的元素以指定的分隔符连接成一个字符串，并返回这个字符串。
 参数说明：
 - `table`：被连接的表格。
 - `sep`：可选的分隔符，用于在每个元素之间分隔，默认为空字符串。
 - `i`：可选的起始下标，默认为 1。
 - `j`：可选的结束下标，默认为表格长度。
 返回值：连接后的字符串。

 使用示例：]]
local t = {"foo", "bar", "baz"}
print(table.concat(t))        --> foobarbaz
print(table.concat(t, ", "))  --> foo, bar, baz
print(table.concat(t, "-", 2)) --> bar-baz

--[[### 14. `table.insert` 函数用于往一个表格中插入元素，并返回新元素所在的索引。
函数定义：
table.insert(list, [pos,] value)
参数说明：
- `list`: 需要被插入元素的表格。
- `pos`: 可选参数，表示需要插入的位置，默认为表格末尾。
- `value`: 待插入的值。
返回值：新插入的元素的索引。

使用示例：--]]
local t = {1,2,3,4}
table.insert(t, 2, 5) -- 在第二个位置插入元素5
print(table.concat(t, ", ")) --输出：1,5,2,3,4

table.insert(t, 6) -- 在末尾插入元素6
print(table.concat(t, ", ")) --输出：1,5,2,3,4,6

--[[在上面的示例中，我们先是在表格 `t` 的第二个位置插入了元素 `5`，然后又在表格 `t` 的末尾插入了元素 `6`，最终通过 `table.concat` 函数将表格转化为字符串输出。

### 15. table.remove(table, [pos])
从一个表格中删除一个元素，并返回它的值。
参数说明：
- `table`：待删除元素的表格。
- `pos`：可选的目标位置，表示要删除的元素的索引，默认为表格末尾。

使用示例：--]]
local t = {"foo", "bar", "baz"}
table.remove(t, 2)
print(table.concat(t, ", "))  --> foo, baz

table.remove(t)
print(table.concat(t, ", "))  --> foo

--[[io 模块是 的标准库之一，主要提供了访问文件、流和操作系统的基础功能。具体来说，该模块包含以下 22 个函数：
1. io.close(file)：关闭一个已经打开的文件。
2. io.flush()：刷新缓冲区。
3. io.input([filename])：获取或设置默认输入源。
4. io.lines([filename, ...])：返回一个迭代器，用于逐行读取文件中的内容。
5. io.open(filename [, mode])：打开一个文件并返回其文件句柄。
6. io.output([filename])：获取或设置默认输出源。
7. io.popen(prog [, mode])：打开一个管道并返回其文件句柄。
8. io.read(...)：从默认输入源读取数据。
9. io.tmpfile()：创建一个临时文件并返回其文件句柄。
10. io.type(obj)：返回给定对象的类型。
11. io.write(...)：向默认输出源写入数据。
12. io.stdin：标准输入文件句柄。
13. io.stdout：标准输出文件句柄。
14. io.stderr：标准错误文件句柄。
15. file:close()：关闭一个已经打开的文件。
16. file:flush()：刷新缓冲区。
17. file:lines([format])：返回一个迭代器，用于逐行读取文件中的内容。
18. file:read(...)：从文件中读取数据。
19. file:seek([whence [, offset]-])：在文件中移动指针的位置。
20. file:setvbuf(mode [, size])：设置文件的缓冲模式和大小。
21. file:write(...)：向文件写入数据。
22. handle:close()：关闭一个已经打开的文件或管道。--]]
--[[1. io.close(file)：关闭一个已经打开的文件。
使用方法：
local file = io.open("example.txt", "r")
-- 进行一些操作
io.close(file)
使用示例：--]]

local file = io.open("example.txt", "r")
local content = file:read("*all")
print(content)
io.close(file)

--[[这个示例中，我们使用io.open()打开了一个文件，并使用file:read()读取了文件中的全部内容。然后使用io.close()关闭了文件。

2. io.flush()：刷新缓冲区。
使用方法：
io.flush()
使用示例：--]]

io.write("Hello, world!")
io.flush()

--[[这个示例中，我们使用io.write()写入了一段文本，然后使用io.flush()强制将缓冲区中的内容输出到屏幕上。

3. io.input([filename])：获取或设置默认输入源。
使用方法：
io.input("example.txt")
使用示例：--]]

io.input("example.txt")
local content = io.read("*all")
print(content)

--[[这个示例中，我们使用io.input()设置默认的输入源为example.txt，然后使用io.read()读取文件中的全部内容并打印出来。

4. io.lines([filename, ...])：返回一个迭代器，用于逐行读取文件中的内容。
使用方法：
for line in io.lines("example.txt") do
  print(line)
end
使用示例：--]]

for line in io.lines("example.txt") do
  print(line)
end

--[[这个示例中，我们使用io.lines()返回一个迭代器，用于逐行读取example.txt文件中的内容，并打印出来。

5. io.open(filename [, mode])：打开一个文件并返回其文件句柄。
使用方法： local file = io.open("example.txt", "r")
使用示例：--]]

local file = io.open("example.txt", "r")
local content = file:read("*all")
print(content)
file:close()

--[[这个示例中，我们使用io.open()打开了example.txt文件，并使用文件句柄的read()方法读取了文件中的全部内容，然后关闭了文件。

6. io.output([filename])：获取或设置默认输出源。
使用方法： io.output("output.txt")
使用示例：--]]

io.output("output.txt")
io.write("Hello, world!")
io.close()

--[[这个示例中，我们使用io.output()设置默认的输出源为output.txt，然后使用io.write()写入文本并关闭文件。

7. io.popen(prog [, mode])：打开一个管道并返回其文件句柄。
使用方法： local pipe = io.popen("ls", "r")
使用示例：--]]

local pipe = io.popen("ls", "r")
for filename in pipe:lines() do
  print(filename)
end
pipe:close()

--[[这个示例中，我们使用io.popen()打开了一个管道，并使用文件句柄的lines()方法逐行读取了管道中的输出，并打印出来。

8. io.read(...)：从默认输入源读取数据。
使用方法： local content = io.read("*all")
使用示例：--]]

io.input("example.txt")
local content = io.read("*all")
print(content)

--[[这个示例中，我们使用io.input()设置默认的输入源为example.txt，然后使用io.read()读取文件中的全部内容并打印出来。

9. io.tmpfile()：创建一个临时文件并返回其文件句柄。
使用方法： local temp_file = io.tmpfile()
使用示例：--]]

local temp_file = io.tmpfile()
temp_file:write("Hello, world!")
temp_file:seek("set", 0)
print(temp_file:read("*all"))
temp_file:close()

--[[这个示例中，我们使用io.tmpfile()创建了一个临时文件，并向文件中写入了一段文本。然后将文件指针移回文件开头，并使用read()方法读取了文件中的全部内容，并关闭了文件。

10. io.type(obj)：返回给定对象的类型。
使用方法： local file_type = io.type(file)
-- 返回 "file" 或 "closed file"
使用示例：--]]

local file = io.open("example.txt", "r")
local file_type = io.type(file)
print(file_type)
file:close()

--[[这个示例中，我们使用io.open()打开了example.txt文件，并使用io.type()检查文件句柄的类型。然后关闭了文件。

11. io.write(...)：向默认输出源写入数据。
使用方法： io.write("Hello, world!")
使用示例：--]]

io.output("output.txt")
io.write("Hello, world!")
io.close()

--[[这个示例中，我们使用io.output()设置默认的输出源为output.txt，然后使用io.write()写入文本并关闭文件。

12. io.stdin：标准输入文件句柄。
使用方法： local content = io.stdin:read("*all")
使用示例：--]]

print("Please enter some text:")
local content = io.stdin:read("*all")
print("You entered: " .. content)

--[[这个示例中，我们使用io.stdin文件句柄读取用户从控制台输入的文本，并打印出来。

13. io.stdout：标准输出文件句柄。
使用方法： io.stdout:write("Hello, world!")
使用示例：--]]

io.stdout:write("Please enter some text:")
local content = io.stdin:read("*all")
io.stdout:write("You entered: " .. content)

--[[这个示例中，我们使用io.stdout文件句柄向控制台输出一些文本，并使用io.stdin文件句柄读取用户从控制台输入的文本，并使用io.stdout文件句柄输出相应的信息。

14. io.stderr：标准错误文件句柄。
使用方法： io.stderr:write("Error message")
使用示例：--]]

local num = "not a number"
if not tonumber(num) then
  io.stderr:write("Invalid number: " .. num)
  return
end

--[[这个示例中，我们使用tonumber()函数尝试将给定的字符串转换为数字。如果转换失败，则使用io.stderr文件句柄输出相关的错误信息。

15. file:close()：关闭一个已经打开的文件。
使用方法： file:close()
使用示例：--]]

local file = io.open("example.txt", "r")
local content = file:read("*all")
print(content)
file:close()

--[[这个示例中，我们使用io.open()打开了example.txt文件，并使用read()方法读取了文件中的全部内容。然后使用close()方法关闭了文件。

16. file:flush()：刷新缓冲区。
使用方法： file:flush()
使用示例：--]]

local file = io.open("output.txt", "w")
file:write("Hello, world!")
file:flush()
file:close()

--[[这个示例中，我们使用io.open()打开了output.txt文件，并使用write()方法向文件中写入一段文本。然后使用flush()方法强制将缓冲区中的内容输出到磁盘，并关闭了文件。

17. file:lines([format])：返回一个迭代器，用于逐行读取文件中的内容。
使用方法：
for line in file:lines() do
  print(line)
end
使用示例：--]]

local file = io.open("example.txt", "r")
for line in file:lines() do
  print(line)
end
file:close()

--[[这个示例中，我们使用io.open()打开了example.txt文件，并使用文件句柄的lines()方法逐行读取了文件中的内容，并打印出来。然后使用close()方法关闭了文件。

18. file:read(...)：从文件中读取数据。
使用方法： local content = file:read("*all")
使用示例：--]]

local file = io.open("example.txt", "r")
local content = file:read("*all")
print(content)
file:close()

--[[这个示例中，我们使用io.open()打开了example.txt文件，并使用文件句柄的read()方法读取了文件中的全部内容，并打印出来。然后使用close()方法关闭了文件。

19. file:seek([whence [, offset].])：在文件中移动指针的位置。
使用方法： file:seek("set", 0)
使用示例：--]]

local file = io.open("example.txt", "r")
file:seek("set", 10)
local content = file:read("*all")
print(content)
file:close()

--[[这个示例中，我们使用io.open()打开了example.txt文件，并使用文件句柄的seek()方法将文件指针移动到文件的第11个字节处。然后使用read()方法读取了文件中的全部内容，并打印出来。最后使用close()方法关闭了文件。

20. file:setvbuf(mode [, size])：设置文件的缓冲模式和大小。
使用方法： file:setvbuf("no")
使用示例：--]]

local file = io.open("output.txt", "w")
file:setvbuf("no")
for i=1, 1000000 do
  file:write(i .. "\n")
end
file:close()

--[[这个示例中，我们使用io.open()打开了output.txt文件，并使用文件句柄的setvbuf()方法设置了文件的缓冲模式为无缓冲。然后向文件中写入1000000行文本并关闭了文件。

21. file:write(...)：向文件写入数据。
使用方法： file:write("Hello, world!")
使用示例：--]]

local file = io.open("output.txt", "w")
file:write("Hello, world!")
file:close()

--[[这个示例中，我们使用io.open()打开了output.txt文件，并使用文件句柄的write()方法向文件中写入一段文本，并关闭了文件。

22. handle:close()：关闭一个已经打开的文件或管道。
使用方法： handle:close()
使用示例：--]]

local handle = io.popen("ls", "r")
for filename in handle:lines() do
  print(filename)
end
handle:close()

--[[这个示例中，我们使用io.popen()打开了一个管道，并使用文件句柄的lines()方法逐行读取了管道中的输出，并打印出来。然后使用close()方法关闭了文件句柄。
--]]

--[[需要注意的是，在使用 io.open() 函数打开文件时，若未指定访问模式，则该函数默认以只读模式打开文件。如果需要以其他模式打开文件，需要显式指定访问模式（如io.open(filename, "w") 表示以写入模式打开文件）。同时，在对文件进行操作后，需要及时调用 file:close() 函数来关闭文件句柄以释放资源。

string 模块是 的标准库之一，主要提供了一系列用于处理字符串的函数。具体来说，该模块包含以下 38 个函数：
1. string.byte(s [, i [, j]-])：返回指定位置的字符的 ASCII 码值。
2. string.char(...)：将指定的 ASCII 码值转换为字符。
3. string.dump(function)：将指定函数编码为一个二进制字符串。
4. string.find(s, pattern [, init [, plain]-])：在 s 中查找第一个匹配 pattern 的子串，并返回其起始和结束位置。
5. string.format(formatstring, ...)：将若干参数格式化为一个字符串。
6. string.gmatch(s, pattern)：返回一个迭代器，用于遍历 s 中所有匹配 pattern 的子串。
7. string.gsub(s, pattern, repl [, n])：将 s 中所有被 pattern 匹配到的子串替换为 repl，并返回替换后的字符串。
8. string.len(s)：返回字符串 s 的长度。
9. string.lower(s)：将字符串 s 转换为小写字母形式。
10. string.match(s, pattern [, init])：在 s 中查找第一个匹配 pattern 的子串，并返回该子串。
11. string.pack(fmt, v1, v2, ...)：按照指定的格式 fmt 将若干个值打包成一个二进制字符串。
12. string.packsize(fmt)：返回按照指定格式打包的数据所需要的空间大小。
13. string.rep(s, n)：返回将字符串 s 重复 n 次后得到的字符串。
14. string.reverse(s)：将字符串 s 倒序排列。
15. string.sub(s, i [, j])：返回字符串 s 中从位置 i 到位置 j 的子串。
16. string.packsignednumber(num, bitsize, endian)：以指定的比特位数和字节序打包有符号整数。
17. string.packunsignednumber(num, bitsize, endian)：以指定的比特位数和字节序打包无符号整数。
18. string.unpack(fmt, s [, pos])：根据指定的格式 fmt，从二进制字符串 s 中解析出若干个值。
19. string.unpacksize(fmt)：返回指定格式的数据在二进制字符串中的长度。
20. string.upper(s)：将字符串 s 转换为大写字母形式。
21. string.formatnumber(fmt, num)：将数字按指定格式转换成字符串。
22. string.findlast(s, pattern [, init [, plain]-])：在 s 中查找最后一个匹配 pattern 的子串，并返回其起始和结束位置。
23. string.gfind(s, pattern)：返回一个迭代器，用于遍历 s 中所有匹配 pattern 的子串。
24. string.gsubex(s, pattern, repl)：将 s 中所有被 pattern 匹配到的子串替换为 repl，并返回替换后的字符串。
25. string.formatbytes(bytes, [mode])：将数字按格式转换成可读的字节表示形式。
26. string.split(s, sep)：将字符串 s 按分隔符 sep 切割，并返回一个包含所有子串的数组。
27. string.join(sep, ...): 将多个字符串按顺序拼接成一个字符串，使用 sep 作为分隔符。
28. string.ltrim(s)：去除 s 左侧的所有空白字符。
29. string.rtrim(s)：去除 s 右侧的所有空白字符。
30. string.trim(s)：去除 s 左右两端的所有空白字符。
31. string.starts(s, substr)：判断字符串 s 是否以 substr 开头。
32. string.ends(s, substr)：判断字符串 s 是否以 substr 结尾。
33. string.random(n)：返回一个由 n 个随机大写字母组成的字符串。
34. string.base64enc(data)：对给定数据进行 Base64 编码。
35. string.base64dec(str)：对给定字符串进行 Base64 解码。
36. string.xor(a, b)：对字符串 a 和 b 逐位做异或运算并返回结果。
37. string.utf8len(s)：返回字符串 s 中的 UTF-8 字符数。
38. string.utf8sub(s, i, j)：返回字符串 s 中从第 i 个字符到第 j 个字符之间的子串。--]]

-- string 模块是 Lua 编程语言的标准库之一，提供了丰富的字符串处理函数。下面详细介绍每个函数的用法，并给出使用示例。

--[[1. string.byte(s [, i [, j]--])
返回指定位置的字符的 ASCII 码值。
- s: 待处理的字符串。
- i, j: 可选参数，表示要处理的区间。默认为整个字符串。
示例：--]]

s = "hello"
a = string.byte(s, 2)   -- 取出第二个字符的 ASCII 码值
print(a)                --> 101

--[[2. string.char(...)
将指定的 ASCII 码值转换为字符。
- ...: 多个待转换的 ASCII 码值。
示例：--]]

a = string.char(97, 98, 99)    -- 将 97, 98, 99 转换成 "abc" 字符串
print(a)                       --> abc

--[[3. string.dump(function)
将指定函数编码为一个二进制字符串。
- function: 待编码的函数。
示例：--]]

function test()
    print("hello world")
end

-- a = string.dump(test)   -- 将函数 test 编码成二进制字符串
-- load(a)()               --> 执行编码后的函数，输出 hello world

--[[4. string.find(s, pattern [, init [, plain]--])
在 s 中查找第一个匹配 pattern 的子串，并返回其起始和结束位置。
- s: 待处理的字符串。
- pattern: 要查找的模式。
- init: 可选参数，指定开始查找的位置。默认为 1。
- plain: 可选参数，是否关闭正则表达式特性。默认为 false。
示例：--]]

s = "hello world"
a, b = string.find(s, "wo")   -- 查找子串 "wo" 的起始和结束位置
print(a, b)                  --> 7 8

a, b = string.find(s, "%w+", 1, true)   -- 查找第一个单词的位置
print(a, b)                            --> 1 5

--[[5. string.format(formatstring, ...)
将若干参数格式化为一个字符串。
- formatstring: 格式化字符串，其中 %X 表示以特定方式格式化第 X 个参数。
- ...: 待格式化的参数。
示例：--]]

a = 10
b = "world"
s = string.format("hello %d %s", a, b)   -- 格式化输出字符串
print(s)                                 --> hello 10 world

--[[6. string.gmatch(s, pattern)
返回一个迭代器，用于遍历 s 中所有匹配 pattern 的子串。
- s: 待处理的字符串。
- pattern: 要匹配的模式。
示例：--]]

s = "hello world"
for word in string.gmatch(s, "%w+") do
    print(word)
end
-- 依次输出 "hello" 和 "world"

--[[7. string.gsub(s, pattern, repl [, n])
将 s 中所有被 pattern 匹配到的子串替换为 repl，并返回替换后的字符串。
- s: 待处理的字符串。
- pattern: 要匹配的模式。
- repl: 要替换成的字符串。
- n: 可选参数，表示最多替换的次数。默认为全部替换。
示例：--]]

s = "hello world"
t = string.gsub(s, "world", "Lua")   -- 将子串 "world" 替换成 "Lua"
print(t)                             --> hello Lua

t = string.gsub(s, "l", "L", 1)      -- 将第一个 "l" 替换成 "L"
print(t)                             --> heLlo world

--[[8. string.len(s)
返回字符串 s 的长度。
示例：--]]

s = "hello world"
print(string.len(s))   --> 11

--[[9. string.lower(s)
将字符串 s 转换为小写字母形式。
示例：--]]

s = "HELLO WORLD"
print(string.lower(s))   --> hello world

--[[10. string.match(s, pattern [, init])
在 s 中查找第一个匹配 pattern 的子串，并返回该子串。
- s: 待处理的字符串。
- pattern: 要匹配的模式。
- init: 可选参数，指定开始查找的位置。默认为 1。
示例：--]]

s = "hello world"
t = string.match(s, "%w+")    -- 查找第一个单词
print(t)                      --> hello

--[[11. string.pack(fmt, v1, v2, ...)
按照指定的格式 fmt 将若干个值打包成一个二进制字符串。
- fmt: 打包数据的格式字符串。其中有特定符号表示要打包的数据类型。
- v1, v2, ...: 待打包的数据。
示例：--]]

--[[t = {1, 2, 3}
s = string.pack("ii{}", 10, 20, t)   -- 打包 10, 20 和表 t
print(string.len(s))                  --> 16
--]]

--[[12. string.packsize(fmt)
返回按照指定格式打包的数据所需要的空间大小。
- fmt: 打包数据的格式字符串。
示例：--]]

-- print(string.packsize("ii{}"))   --> 16

--[[13. string.rep(s, n)
返回将字符串 s 重复 n 次后得到的字符串。
- s: 待重复的字符串。
- n: 重复次数。
示例：--]]

s = "hello"
t = string.rep(s, 3)   -- 将字符串 s 重复 3 次
print(t)               --> hellohellohello

--[[14. string.reverse(s)
将字符串 s 倒序排列。
示例：--]]

s = "hello"
t = string.reverse(s)   -- 将字符串倒序排列
print(t)                --> olleh

--[[15. string.sub(s, i [, j])
返回字符串 s 中从位置 i 到位置 j 的子串。
- s: 待处理的字符串。
- i, j: 表示要处理的区间。j 可选，默认为字符串结尾。
示例：--]]

s = "hello world"
t = string.sub(s, 7, 11)   -- 取出子串 "world"
print(t)                    --> world

--[[16. string.packsignednumber(num, bitsize, endian)
以指定的比特位数和字节序打包有符号整数。
- num: 待打包的有符号整数。
- bitsize: 指定整数占用的比特位数。
- endian: 指定字节序，可为 "little" 或 "big"。
示例：

s = string.packsignednumber(-10, 16, "big")   -- 将数字 -10 打包成 2 字节二进制字符串
print(string.len(s))                          --> 2--]]

--[[17. string.packunsignednumber(num, bitsize, endian)
以指定的比特位数和字节序打包无符号整数。
- num: 待打包的无符号整数。
- bitsize: 指定整数占用的比特位数。
- endian: 指定字节序，可为 "little" 或 "big"。
示例：--]]

--[[s = string.packunsignednumber(65535, 16, "little")   -- 将数字 65535 打包成 2 字节二进制字符串
print(string.len(s))                                 --> 2
--]]

--[[18. string.unpack(fmt, s [, pos])
根据指定的格式 fmt，从二进制字符串 s 中解析出若干个值。
- fmt: 解析数据的格式字符串。其中有特定符号表示要解析的数据类型。
- s: 待解析的二进制字符串。
- pos: 可选参数，指定从哪个位置开始解析数据。默认为 1。
示例：--]]

--[[s = string.pack("ii{}", 10, 20, {30, 40})
a, b, t = string.unpack("ii{?}", s)   -- 根据格式字符串解析出数据
print(a, b, t[1], t[2])               --> 10, 20, 30, 40--]]

--[[19. string.unpacksize(fmt)
返回指定格式的数据在二进制字符串中的长度。
- fmt: 解析数据的格式字符串。
示例：--]]

-- print(string.unpacksize("ii{}"))   --> 16

--[[20. string.upper(s)
将字符串 s 转换为大写字母形式。
示例：--]]

s = "hello world"
print(string.upper(s))   --> HELLO WORLD

--[[21. string.formatnumber(fmt, num)
将数字按指定格式转换成字符串。
- fmt: 要转换成的字符串的格式。
- num: 待转换的数字。
示例：--]]

-- s = string.formatnumber("%.2f", 3.14159)   -- 将 3.14159 转换成保留两位小数的字符串
-- print(s)                                   --> 3.14

--[[22. string.findlast(s, pattern [, init [, plain]-])
在 s 中查找最后一个匹配 pattern 的子串，并返回其起始和结束位置。
- s: 待处理的字符串。
- pattern: 要匹配的模式。
- init: 可选参数，指定开始查找的位置。默认为字符串结尾。
- plain: 可选参数，是否关闭正则表达式特性。默认为 false。
示例：--]]

-- s = "hello world hello"
-- a, b = string.findlast(s, "hello")   -- 查找最后一个子串 "hello" 的位置
-- print(a, b)                         --> 13 17

--[[23. string.gfind(s, pattern)
返回一个迭代器，用于遍历 s 中所有匹配 pattern 的子串。
- s: 待处理的字符串。
- pattern: 要匹配的模式。
示例：--]]

s = "hello world"
for word in string.gfind(s, "%w+") do
    print(word)
end
-- 依次输出 "hello" 和 "world"

--[[24. string.gsubex(s, pattern, repl)
将 s 中所有被 pattern 匹配到的子串替换为 repl，并返回替换后的字符串。与 string.gsub 功能类似，但支持传入函数参数进行替换。
- s: 待处理的字符串。
- pattern: 要匹配的模式。
- repl: 要替换成的字符串，或者接受被匹配子串作为参数并返回替换字符串的函数。
示例：--]]

-- s = "hello world"
-- t = string.gsubex(s, "%w+", function(w)
--     return w:upper()
-- end)
-- print(t)   --> HELLO WORLD

--[[25. string.formatbytes(bytes, [mode])
将数字按格式转换成可读的字节表示形式。
- bytes: 待转换的字节数。
- mode: 可选参数，表示输出单位的模式。当 mode 为 1 时，输出后缀为 "B"；当 mode 为 2 时，输出后缀为 "Byte"。
示例：--]]

-- s = string.formatbytes(1024)         -- 将 1024 转换成可读的字节表示形式
-- print(s)                             --> 1KB

-- s = string.formatbytes(1024, 2)      -- 将 1024 转换成可读的字节表示形式，后缀为 "Byte"
-- print(s)                             --> 1KByte

--[[26. string.split(s, sep)
将字符串 s 按分隔符 sep 切割，并返回一个包含所有子串的数组。
- s: 待处理的字符串。
- sep: 分隔符。
示例：
--]]
-- s = "hello,world,Lua"
-- t = string.split(s, ",")   -- 将字符串按逗号切割成数组
-- for i, v in ipairs(t) do
--     print(v)
-- end
-- -- 依次输出 "hello", "world", "Lua

-- os 模块是 的标准库之一，主要提供了一些系统操作相关的函数。具体来说，该模块包含以下 15 个函数：
-- os 模块是 Lua 标准库中的一个核心模块，提供了与操作系统相关的操作函数。常用的 os 模块函数包括：
-- 1. os.clock()：返回程序执行的 CPU 时间（以秒为单位）。
local start_time = os.clock() -- 记录程序开始执行的时间
-- do something
local end_time = os.clock() -- 记录程序结束执行的时间
print("程序执行时间：" .. tostring(end_time - start_time) .. "秒")

-- 2. os.date([format [, time]])：返回一个表示指定时间格式的字符串。
local now = os.time()  -- 获取当前时间戳
local str = os.date("%Y-%m-%d %H:%M:%S", now)  -- 将时间戳格式化为 "年-月-日 时:分:秒" 的字符串
print(str)

-- 3. os.difftime(t2, t1)：返回两个时间点之间的差值（以秒为单位）。
local start_time = os.time()  -- 记录开始时间
-- do something
local end_time = os.time()  -- 记录结束时间
local diff_time = os.difftime(end_time, start_time)  -- 计算时间差
print("程序执行时间：" .. tostring(diff_time) .. "秒")

-- 4. os.execute(cmd)：在新的进程中运行指定的命令。
os.execute("ls -l")  -- 在 Linux 系统上列出当前目录下的文件和文件夹的详细信息

-- 5. os.exit([code [, close]])：终止当前进程，并返回指定的退出码。
os.exit(1)  -- 终止当前进程，并返回退出码 1

-- 6. os.getenv(varname)：返回指定环境变量的值。
local path = os.getenv("PATH")  -- 获取 PATH 环境变量的值
print(path)

-- 7. os.remove(filename)：删除指定的文件。
os.remove("test.txt")  -- 删除当前目录下的 test.txt 文件

-- 8. os.rename(oldname, newname)：重命名指定的文件。
os.rename("oldname.txt", "newname.txt")  -- 将 oldname.txt 文件重命名为 newname.txt 文件

-- 9. os.setlocale(locale [, category])：设置当前程序的区域设置。
os.setlocale("zh_CN.UTF-8")  -- 设置当前程序的区域设置为中文（简体）UTF-8 编码

-- 10. os.time([table])：返回指定时间的时间戳。
local time_table = {year=2023, month=6, day=11, hour=10, min=30, sec=0}
local timestamp = os.time(time_table)  -- 将指定的时间转换为时间戳
print(timestamp)

-- 11. os.tmpname()：返回一个可用的临时文件名。
local tmp_filename = os.tmpname()  -- 获取一个可用的临时文件名
print(tmp_filename)

-- 12. os.getpid()：返回当前进程的 ID。
local pid = os.getpid()  -- 获取当前进程的 ID
print(pid)

-- 13. os.setenv(varname, value)：设置指定环境变量的值。
os.setenv("MY_VARIABLE", "value")  -- 设置 MY_VARIABLE 环境变量的值为 value

-- 14. os.getenvs()：返回当前所有的环境变量及其值。
local envs = os.getenvs()  -- 获取当前所有的环境变量及其值
for varname, value in pairs(envs) do
  print(varname .. "=" .. value)
end

-- 15. os.sleep(s)：暂停当前线程 s 秒钟。
print("开始休眠")
os.sleep(5)  -- 暂停当前线程 5 秒钟
print("休眠结束")

--[[需要注意的是，一些 os 模块的函数可能受到操作系统和 环境的限制，无法在特定环境中正常运行。例如，os.execute() 函数在某些操作系统上可能受到安全策略的限制。因此，在使用 os 模块的函数时需要特别留意这些限制，并根据需要进行相应的处理。
需要注意的是，在使用 中的字符串处理函数时，需要特别留意字符串的编码方式。默认情况下， 使用的是字节流的编码方式，即每个字符都由一个或多个字节组成。而在处理 Unicode 编码的字符串时，需要使用相应的编码函数（如 utf8len() 和 utf8sub()）。此外，在处理中文字符串时还需要注意是否存在字符集转换的问题。
--]]