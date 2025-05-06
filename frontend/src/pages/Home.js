import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        // Fetch featured products
        const productsQuery = query(collection(db, 'products'), limit(3));
        const productsSnapshot = await getDocs(productsQuery);
        const products = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeaturedProducts(products);

        // Fetch featured services
        const servicesQuery = query(collection(db, 'services'), limit(3));
        const servicesSnapshot = await getDocs(servicesQuery);
        const services = servicesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFeaturedServices(services);
      } catch (error) {
        console.error('Error fetching featured items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to Fintech Marketplace
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Discover the best fintech products and services from global suppliers
        </Typography>
      </Box>

      <Box my={6}>
        <Typography variant="h4" gutterBottom>
          Featured Products
        </Typography>
        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl || 'https://via.placeholder.com/300'}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" mt={2}>
                    ${product.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box my={6}>
        <Typography variant="h4" gutterBottom>
          Featured Services
        </Typography>
        <Grid container spacing={4}>
          {featuredServices.map((service) => (
            <Grid item key={service.id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={service.imageUrl || 'https://via.placeholder.com/300'}
                  alt={service.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {service.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                  <Typography variant="h6" color="primary" mt={2}>
                    ${service.price}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/services/${service.id}`)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box my={6} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Global Reach
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Access products and services from suppliers worldwide
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Secure Payments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Safe and reliable payment processing
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Verified Suppliers
            </Typography>
            <Typography variant="body1" color="text.secondary">
              All suppliers are thoroughly vetted and verified
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Home; 