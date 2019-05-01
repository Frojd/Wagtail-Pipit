""
"" This is a general vim configuration
""
"" From:
"" https://raw.githubusercontent.com/Frojd/Wagtail-Pipit/master/config/.vimrc
""
"" Installing:
"" curl -L https://raw.githubusercontent.com/Frojd/Wagtail-Pipit/master/config/.vimrc > ~/.vimrc


" Basic Setup {{{
set nocompatible                " be iMproved, required
filetype off                    " required
syntax enable

set autoindent
let mapleader=","
set number                      " Show line numbers
set ruler                       " Show line and column number
set nobackup
set nowritebackup
set noswapfile
set encoding=utf-8              " Set default encoding to UTF-8
set tags=./tags,./.tags,tags,.tags;/
set clipboard=unnamed

" }}}


" Whitespace {{{
set smartindent
set tabstop=4                     " a hard TAB displays as 4 columns
set shiftwidth=4                  " operation >> indents 4 columns; << unindents 4 columns
set softtabstop=4                 " insert/delete 4 spaces when hitting a TAB/BACKSPACE
set expandtab                     " insert spaces when hitting TABs
set list                          " Show invisible characters
set backspace=indent,eol,start    " backspace through everything in insert mode

" List chars
set listchars=""                  " Reset the listchars
set listchars=tab:\ \             " a tab should display as "  ", trailing whitespace as "."
set listchars+=trail:.            " show trailing spaces as dots
set listchars+=extends:>          " The character to show in the last column when wrap is
                                  " off and the line continues beyond the right of the screen
set listchars+=precedes:<         " The character to show in the last column when wrap is
                                  " off and the line continues beyond the left of the screen
" }}}


" Searching {{{

set hlsearch                      " highlight matches
set incsearch                     " incremental searching
set ignorecase                    " searches are case insensitive...
set smartcase                     " ... unless they contain at least one capital letter
set path+=**                      " Add recursive search for find
set wildmenu                      " Add tabbed search result

" }}}



" Plugin / Netrw {{{

" Open netrw on -
nmap - :Ex<CR>

" Hide header
let g:netrw_banner=0

" }}}
