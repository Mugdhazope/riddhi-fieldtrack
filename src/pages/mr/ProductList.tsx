import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Package, 
  Search, 
  ArrowLeft, 
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import { mockProducts, getProductPromotionCounts, Product } from '@/data/mockData';

interface ProductWithStats extends Product {
  promotionCounts: { today: number; week: number; month: number };
}

export default function ProductList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const productsWithStats: ProductWithStats[] = mockProducts
    .filter(p => p.status === 'active')
    .map(product => ({
      ...product,
      promotionCounts: getProductPromotionCounts(product.id),
    }));

  const filteredProducts = productsWithStats.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPromotionsToday = productsWithStats.reduce((sum, p) => sum + p.promotionCounts.today, 0);
  const totalPromotionsWeek = productsWithStats.reduce((sum, p) => sum + p.promotionCounts.week, 0);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/mr')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">Product List</h1>
              <p className="text-xs text-muted-foreground">All products available for promotion</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 max-w-lg">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-primary">{productsWithStats.length}</div>
              <p className="text-xs text-muted-foreground">Active Products</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-secondary">{totalPromotionsToday}</div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-pharma-blue">{totalPromotionsWeek}</div>
              <p className="text-xs text-muted-foreground">This Week</p>
            </CardContent>
          </Card>
        </div>

        {/* Product List */}
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{product.description}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Promotion Stats */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-xs">
                      <span className="font-medium">{product.promotionCounts.today}</span>
                      <span className="text-muted-foreground"> today</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-pharma-blue" />
                    <span className="text-xs">
                      <span className="font-medium">{product.promotionCounts.week}</span>
                      <span className="text-muted-foreground"> this week</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs">
                      <span className="font-medium">{product.promotionCounts.month}</span>
                      <span className="text-muted-foreground"> this month</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
