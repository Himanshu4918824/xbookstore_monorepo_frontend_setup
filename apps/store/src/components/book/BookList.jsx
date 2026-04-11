import React from 'react';
import { Grid } from '@mui/material';
import BookCard from './BookCard';
import BookListItem from './BookListItem';

// This component receives the list of books and the layout as props.
// Its only job is to render the correct view.
function BookList({ books, layout }) {
  return (
    // This is the container for all the book items.
    // The key={layout} prop is a powerful trick: it tells React to create a
    // brand new container from scratch every time the layout changes,
    // which prevents any old styling or layout glitches.
    <Grid container spacing={3} key={layout}>
      {books.map((book) => {
        // We determine the grid sizing based on the current layout.
        const itemProps = layout === 'grid'
          ? { xs: 12, sm: 6, md: 4 } // For Grid View
          : { xs: 12 };              // For List View (always full-width)

        return (
          <Grid item key={book.id} {...itemProps}>
            {/* We render either the Card or the List Item */}
            {layout === 'grid' 
                ? <BookCard book={book} /> 
                : <BookListItem book={book} />
            }
          </Grid>
        );
      })}
    </Grid>
  );
}

export default BookList;