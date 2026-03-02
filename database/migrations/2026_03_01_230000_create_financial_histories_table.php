<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('financial_histories', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->foreignId('user_id')->constrained()->onDelete('cascade');
            $blueprint->date('date');
            $blueprint->decimal('liquidity', 15, 2)->default(0);
            $blueprint->decimal('assets_value', 15, 2)->default(0);
            $blueprint->decimal('net_worth', 15, 2)->default(0);
            $blueprint->timestamps();

            $blueprint->unique(['user_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_histories');
    }
};
