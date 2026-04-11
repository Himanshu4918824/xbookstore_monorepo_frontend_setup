import { Grid } from '@mui/material';
import BookCard from './BookCard';
import BookListItem from './BookListItem';

function BookDisplay({ books, layout }) {
  return (
    <Grid container spacing={3} key={layout}>
      {books.map((book) => {
        const sizeProps = layout === 'grid'
          ? { xs: 12, sm: 6, md: 3}
          : { xs: 12 };
        return (
          <Grid key={book.id} size={sizeProps}> {/* <-- UPDATED */}
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
export default BookDisplay;